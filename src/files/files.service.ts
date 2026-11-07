import  {join} from 'path'
import  {existsSync} from 'fs'
import {BadRequestException, Injectable} from '@nestjs/common';

@Injectable()
export class FilesService {


    getStaticProductImage(imageName: string) {
        const path = join(__dirname,'../../static/uploads/',imageName);

        if (!existsSync(path)) {
            throw  new BadRequestException('No such fsssile exists');
        }
        return path;
    }
}
