import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User, IUser, UserType, SubscriptionStatus } from '../models/user';
import { UserRepository } from '../repositories/user-repository';
import { envPrivateVars } from '../config/env-vars';
import { IDigitalAsset } from '../models/digital-assset';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { s3 } from '../config/aws-config';
import { v4 as uuidv4 } from 'uuid';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async registerCompany(
    username: string,
    password: string,
    companyName: string,
  ): Promise<IUser> {
    const existingUser = await this.userRepository.findByUsername(username);
    if (existingUser) {
      throw new Error('Este email no puede ser utilizado.');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new User({
      username,
      password: hashedPassword,
      userType: UserType.company,
      company: {
        companyName,
        subscriptionStatus: SubscriptionStatus.Active,
        authorizationStatus: 'pending',
        authorizationDocument: {
          url: '',
        },
      },
    });

    this.userRepository.save(user);
    return user;
  }

  async registerClient(username: string, password: string, name: string) {
    const existingUser = await this.userRepository.findByUsername(username);
    if (existingUser) {
      throw new Error('Username is already taken');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new User({
      username,
      password: hashedPassword,
      name,
      userType: UserType.client,
    });

    this.userRepository.save(user);
    return user;
  }

  async updateUser(username: string, newFields: Partial<IUser>) {
    const existingUser = await this.userRepository.findByUsername(username);
    if (!existingUser) {
      throw new Error('User does not exist');
    }

    for (const [key, value] of Object.entries(newFields)) {
      existingUser.set(key, value);
    }

    this.userRepository.save(existingUser);
    return existingUser;
  }

  async login(username: string, password: string): Promise<string> {
    const existingUser = await this.userRepository.findByUsername(username);
    if (!existingUser) {
      throw new Error('El usuario no existe');
    }

    const isCorrectPassword = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!isCorrectPassword) {
      throw new Error('User does not exist');
    }

    const token = jwt.sign(
      { username: existingUser.username },
      envPrivateVars.jwtTokenSecret,
    );

    return token;
  }

  async subscribe(username: string): Promise<string> {
    const existingUser = await this.userRepository.findByUsername(username);
    if (!existingUser) {
      throw new Error('User does not exist');
    }

    // Simulate setting up a payment
    const paymentId = 'PAYMENT_' + Math.random().toString(36).substr(2, 9);

    return paymentId;
  }

  async getUser(username: string): Promise<IUser> {
    const existingUser = await this.userRepository.findByUsername(username);
    if (!existingUser) {
      throw new Error('User does not exist');
    }

    return existingUser;
  }

  async updateUserAssets(user: IUser, assets: IDigitalAsset[]) {
    // if (!user.company) {
    //   throw new Error('User is not a company');
    // }

    let digitalAssets = user.company!.digitalAssets;
    if (digitalAssets.length > 0) {
      digitalAssets = digitalAssets.concat(assets);
      user.company!.digitalAssets = digitalAssets;
    } else {
      user.company!.digitalAssets = assets;
    }

    return await this.userRepository.save(user);
  }

  async createAuthorizationDocument(user: IUser): Promise<boolean> {
    const companyName = user.company!.companyName;
    const pdfDoc = await PDFDocument.create();
    const titleFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    const bodyFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const page = pdfDoc.addPage([600, 800]);

    page.setFont(bodyFont);
    page.setFontSize(18);
    page.setFontColor(rgb(0, 0, 0));

    page.drawText('Autorización para Actuar en Nuestro Nombre', {
      x: 50,
      y: 750,
      font: titleFont,
      size: 18,
      color: rgb(0, 0, 0),
    });

    page.setFontSize(12);

    const today = new Date();
    const nextYear = new Date(today);
    nextYear.setFullYear(today.getFullYear() + 1);
    const formatDate = (date: Date) =>
      `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    const bodyText = `
    Compañía ${companyName}
    Dirección: [Dirección de la Compañía]
    Teléfono: [Número de Teléfono]
    Correo Electrónico: [Correo Electrónico]

    Fecha: ${formatDate(today)}

    Estimados representantes de Phish Buster,

    Por la presente, nosotros, Compañía X, con dirección en [Dirección de la Compañía], otorgamos a Phish Buster el derecho exclusivo de actuar en nuestro nombre para llevar a cabo las siguientes actividades:

    1. Denunciar y gestionar casos de phishing o suplantación de identidad que involucren a nuestra compañía o a nuestros empleados.
    2. Comunicarse con las plataformas pertinentes para resolver los casos de phishing o suplantación de identidad.
    3. Cualquier otra actividad relacionada con la seguridad cibernética que sea de interés para nuestra compañía.

    Esta autorización es válida desde la fecha de este documento hasta ${formatDate(
      nextYear,
    )}.

    Nos reservamos el derecho de revocar esta autorización en cualquier momento mediante una notificación escrita a Phish Buster.

    Atentamente,

    [Firma Digital o Espacio para Firma Manual]

    [Nombre del Representante Legal]
    [Título del Representante Legal]
  `;

    page.drawText(bodyText, {
      x: 50,
      y: 700,
      lineHeight: 18,
      font: bodyFont,
      size: 12,
      color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();
    const params = {
      Bucket: 'phish-buster-images',
      Key: `${companyName}-${uuidv4()}.pdf`,
      Body: pdfBytes,
      ContentType: 'application/pdf',
    };

    let error = false;
    try {
      const s3Upload = await s3.upload(params).promise();
      const url = s3Upload.Location;
      user.company!.authorizationDocument = {
        url: url,
        expiresAt: nextYear,
      };
      user.company!.authorizationStatus = 'accepted';
    } catch (error) {
      console.log(error);
      error = true;
      user.company!.authorizationStatus = 'pending';
    }

    return error;
  }
}
