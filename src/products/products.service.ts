import {
    BadRequestException,
    HttpCode,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException
} from '@nestjs/common';
import {CreateProductDto} from './dto/create-product.dto';
import {UpdateProductDto} from './dto/update-product.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Product} from "./entities/product.entity";
import {Repository} from "typeorm";
import {PaginationDto} from "../common/dto/pagination.dto";
import {validate as isUUID} from "uuid";

@Injectable()
export class ProductsService {

    private readonly logger = new Logger('ProductsService');

    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) {
    }

    async create(createProductDto: CreateProductDto) {
        try {


            const product = this.productRepository.create(createProductDto);
            await this.productRepository.save(product);
            return product;

        } catch (error) {
            this.handleException(error);

        }
    }

    async findAll(paginationDto: PaginationDto) {
        const {limit = 10, offset = 0} = paginationDto;
        return await this.productRepository.findAndCount({
            skip: offset,
            take: limit,


            //TODO RELATIONS
        });
    }

    async findOne(term: string) {

        let product: Product | null;

        if (isUUID(term)) {
            product = await this.productRepository.findOneBy({id: term})
        } else {
            const queryBuilder = this.productRepository
                .createQueryBuilder();

            product = await queryBuilder
                .where('UPPER(title) =:title or  slug =:slug', {
                    title: term.toUpperCase(),
                    slug: term.toLowerCase()
                }).getOne()

        }


        if (!product) {
            throw new NotFoundException("The product with id " + term + " not found");
        }
        return product;
    }

    async update(id: string, updateProductDto: UpdateProductDto) {

        const product = await this.productRepository.preload({
            id: id,
            ...updateProductDto
        });

        if (!product) {
            throw new NotFoundException("The product with id " + id + " not found");
        }

        try {
            await this.productRepository.save(product);

        }catch(error) {
         this.handleException(error);
        }



        return product;
    }

    async remove(id: string) {

        const product = await this.findOne(id);
        await this.productRepository.remove(product);

    }

    private handleException(error: any) {

        if (error.code === '23505') {
            throw new BadRequestException(error.detail);
        }


        this.logger.error(error);

        throw new InternalServerErrorException("Unexpected error occurred.   check logged in");
    }
}
