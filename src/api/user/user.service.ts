import { UserExistsError } from "../../errors/UserExists";
import { UserIdentityModel } from "../../lib/auth/local/user-identity.model";
import { User } from "./user.entity";
import { UserModel } from "./user.model";
import bcrypt from 'bcrypt';

export class UserService {

    async add(user: User, credentials: {username: string, password: string}): Promise<User> {
        const existingIdentity = await UserIdentityModel.findOne({'credentials.username': credentials.username});
        if (existingIdentity) {
            throw new UserExistsError();
        }
        const newUser = await UserModel.create(user);
        
        const hashedPassword = await bcrypt.hash(credentials.password, 10);
    
        await UserIdentityModel.create({
            provider: 'local',
            user: newUser.id,
            credentials: {
                username: credentials.username,
                hashedPassword
            }
        });
    
        return newUser;
    }

    async getUsersByRole(role?: string): Promise<User[]> {
        const normalizedRole = role?.trim().toLowerCase();
        if (normalizedRole && !['student', 'teacher'].includes(normalizedRole)) {
            throw new Error('Invalid role');
        }
        const query = normalizedRole ? { role: normalizedRole } : { role: { $in: ['student', 'teacher'] } };
        
        try {
            return await UserModel.find(query);
        } catch (error) {
            console.error('Error fetching users by role:', error);
            throw new Error('Failed to fetch users');
        }
    }
}

export default new UserService();