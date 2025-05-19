import { ulid } from 'ulid';
import prisma from '../../client';
import bcrypt from 'bcrypt';

export const AddParticipants = async () => {
    try {
        if (!process.env.ADMIN_USERNAME) {
            console.error('ADMIN_USERNAME environment variable is not set');
            process.exit();
        }

        const existingAdmin = await prisma.users.findUnique({
            where: { username: process.env.ADMIN_USERNAME },
        });

        if (existingAdmin) {
            console.log('Admin already exists');
            process.exit();
        }

        if (!process.env.ADMIN_PASSWORD) {
            console.error('ADMIN_PASSWORD environment variable is not set');
            process.exit();
        }

        const hashedPassword = await bcrypt.hash(
            process.env.ADMIN_PASSWORD,
            10,
        );
        await prisma.users.create({
            data: {
                id: ulid(),
                username: process.env.ADMIN_USERNAME,
                password: hashedPassword,
                role: 'admin',
            },
        });
        console.log('Admin created');
    } catch (error) {
        console.error(error);
        console.log('Error creating admin');
    } finally {
        console.info('Database connection closed');
        process.exit();
    }
};

AddParticipants();
