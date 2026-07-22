import { hrService } from './src/services/hr.service.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  try {
    const hrUser = await prisma.user.findFirst({ where: { role: 'HR' } });
    if (!hrUser) throw new Error("No HR user found");
    console.log("HR User Tenant ID:", hrUser.tenantId);
    
    const result = await hrService.getDashboard(hrUser.tenantId, {});
    console.log("Success:", !!result);
  } catch (err) {
    console.error("Error occurred:");
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

run();
