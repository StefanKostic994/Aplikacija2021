export class JwtDataAdministratorDto {
    administratorId: number;
    username: string;
    ext: number; //UNIX TIMESTAMP
    ip: string;
    ua: string;
}