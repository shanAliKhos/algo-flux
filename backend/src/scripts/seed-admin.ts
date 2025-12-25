import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { UserRole, UserStatus } from '../users/schemas/user.schema';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';

  try {
    // Check if admin already exists
    const existingAdmin = await usersService.findByEmail(adminEmail);
    if (existingAdmin) {
      console.log('Admin user already exists:', adminEmail);
      await app.close();
      return;
    }

    // Create admin user
    const admin = await usersService.create({
      email: adminEmail,
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email:', admin.email);
    console.log('Password:', adminPassword);
    console.log('Please change the password after first login.');
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await app.close();
  }
}

bootstrap();

