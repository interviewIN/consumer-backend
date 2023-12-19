const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
	const syawal = await prisma.user.upsert({
		where: { username: "syawal" },
		update: {},
		create: {
            username: "syawal",
			email: "syawal@a.com",
			name: "Syawal",
			password: await bcrypt.hash("inipassword", 10),
			role: "CANDIDATE",
		},
	});

	const Aldwin = await prisma.user.upsert({
		where: { username: "aldwin" },
		update: {},
		create: {
            username: "aldwin",
			email: "ahardiswastia@gmail.com",
			name: "Aldwin",
			password: await bcrypt.hash("inipassword", 10),
            role: "CANDIDATE",
		},
	});

    const Vionie = await prisma.user.upsert({
        where: { username: "vionie" },
        update: {},
        create: {
            username: "vionie",
            email: "vio@a.a",
            name: "Vionie",
            password: await bcrypt.hash("inipassword", 10),
            role: "CANDIDATE",
        },
    });

    const company = await prisma.user.upsert({
        where: { username: "company" },
        update: {},
        create: {
            username: "company",
            email: "company@a.a",
            name: "Company",
            password: await bcrypt.hash("inipassword", 10),
            role: "COMPANY",
        },
    });

    const job = await prisma.job.upsert({
        where: { id: 1 },
        update: {},
        create: {
            title: "Software Engineer",
            description: "Software Engineer",
            company: {
                connect: {
                    id: company.id,
                },
            },
        },
    });

	console.log({ syawal, Aldwin, Vionie, company });
}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
