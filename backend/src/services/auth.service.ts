import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/user.repository';
import { ValidationError, NotFoundError, UnauthorizedError } from '../utils/errors';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-sowaka';

class AuthService {
  async login(email: string, pass: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const valid = await bcrypt.compare(pass, user.password);
    if (!valid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role, tenantId: user.tenantId },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return {
      token,
      user: { id: user.id, name: user.name, role: user.role, email: user.email, avatar: user.avatar, companyName: user.tenant?.name }
    };
  }

  async getUserById(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw new NotFoundError('User not found');
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      companyName: user.tenant?.name
    };
  }

  async updateProfile(userId: string, data: { name?: string; email?: string; avatar?: string; companyName?: string }) {
    const user = await userRepository.updateUser(userId, data);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      companyName: user.tenant?.name
    };
  }
}

export const authService = new AuthService();
