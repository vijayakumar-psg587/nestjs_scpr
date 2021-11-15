export class AppMongoConfigModel {
	protocol: string;
	userName: string;
	password: string;
	cluster: string;
	clusterOptions: string;
	database: string;
	connectionTm?: number;
	keepAlive?: boolean;
}
