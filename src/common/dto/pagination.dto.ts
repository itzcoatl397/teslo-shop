import {IsOptional, IsPositive} from "class-validator";
import {Type} from "class-transformer";

export class PaginationDto {

    @IsOptional()
    @IsPositive()
    //TRANSFORM
    @Type(() => Number)

    limit?: number;
    @IsOptional()
    @IsPositive()
    @Type(() => Number)

    offset?: number;

}