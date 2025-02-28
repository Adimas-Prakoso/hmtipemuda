import bcrypt from 'bcryptjs';

const password = 'admin123';
const saltRounds = 10;

try {
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('Generated hash for password "admin123":', hash);
} catch (err) {
    console.error('Error generating hash:', err);
}
