import mongoose from 'mongoose';
import chalk from 'chalk';

export function connectToDatabase() {
    const mongoURI = process.env.MONGO_URL || `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@mongo:27017/nass?authSource=admin`;
    console.log("Connecting to MongoDB at:", mongoURI);
    // Authenticate and connect to MongoDB
    if (!process.env.MONGO_INITDB_ROOT_USERNAME || !process.env.MONGO_INITDB_ROOT_PASSWORD) {
        console.error('MongoDB credentials are not set in environment variables');
        process.exit(1);
    }
    mongoose.connect(mongoURI);

    mongoose.connection.on('error', (err: Error) => {
        console.error(`MongoDB connection error: ${err}`);
    });

    // Confirm successful connection
    mongoose.connection.once('open', () => {
        console.log('MongoDB connection established successfully. Ready to perform database operations.');

        // Querying service.json to get the picture path and upload it to the database
        const serviceData = require('../software/service.json');
        if (serviceData) {
            console.log(chalk.bold.blue('┌── System Configuration: ' + serviceData.name));
            console.log(chalk.blue('│'));
            console.log(chalk.blue('├─ ') + chalk.bold('Network'));
            console.log(chalk.blue('│  ') + `IP: ${chalk.cyan(serviceData.network['ip-address'].join(', '))}`);
            console.log(chalk.blue('│  ') + `DNS: ${chalk.cyan(serviceData.network['domain-names'].join(', '))}`);
            console.log(chalk.blue('│'));
            console.log(chalk.blue('├─ ') + chalk.bold('Security & Params'));
            console.log(chalk.blue('│  ') + `SSO: ${serviceData.parameters['enable-sso'] ? chalk.green('● Enabled') : chalk.red('○ Disabled')}`);
            console.log(chalk.blue('│  ') + `2FA: ${serviceData.parameters['enable-2fa'] ? chalk.green('● Enabled') : chalk.red('○ Disabled')}`);
            console.log(chalk.blue('│'));
            console.log(chalk.blue('└─ ') + chalk.bold('Environment'));
        }
    });
}