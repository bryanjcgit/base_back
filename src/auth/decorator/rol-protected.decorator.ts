import { SetMetadata } from '@nestjs/common';
import { Rol } from '../interfaces/valid-rol';


export const META_ROL = 'rol'

export const RolProtected = (...args: string[]) => {

    return SetMetadata(META_ROL, args);
}
