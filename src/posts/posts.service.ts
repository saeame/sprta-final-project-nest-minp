import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { IsNull, LessThan, MoreThanOrEqual, Repository } from 'typeorm';
//import { PageMetaDto } from './dto/page-meta.dto';
//import { PageOptionsDto } from './dto/page-options.dto';
//import { PageDto } from './dto/page-info';
import { Post, PostCategoryType } from './post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>
  ) {}

  private logger = new Logger('PostsService');

  async getPosts(page: number = 1) {
    // const take = 7;

    // const [posts, total] = await this.postsRepository.findAndCount({
    //   take,
    //   where: cursor ? {
    //     post_id: MoreThanOrEqual(cursor),
    //   }: null,
    // });

    // const isLastPage = total <= take; 

    // let hasNextPage = true;
    // let hasPreviousPage = false;
    // let endCursor: number;
    // let startCursor: number;

    // if (isLastPage || posts.length <= 0) {
    //   hasNextPage = false;
    //   endCursor = null;
    // } else {
    //   endCursor = posts[posts.length - 1].post_id;
    //   //hasPreviousPage = true;
    // }

    // return {
    //   data: posts,
    //   meta: {
    //     total,
    //     hasNextPage,
    //     hasPreviousPage,
    //     endCursor,
    //     startCursor,
    //   }
    // }

    
    //오프
    const take = 7;
    
    const total = await this.postsRepository.count();
    const posts = await this.postsRepository.find({
	    take,
	    skip: (page - 1) * take,
    });

    const last_Page = Math.ceil(total / take);

    if (last_Page >= page) {
      return {
        data: posts,
        meta: {
          total,
          page: page <= 0 ? (page = 1) : page,
          last_Page: last_Page,
        },
      };
    } else {
      throw new NotFoundException('해당 페이지는 존재하지 않습니다');
    }
  }

  // public static async findByCursor(cursor: number) {
  //   return await this.postsRepository.find({
  //     where: { id: MoreThanOrEqual(cursor) },
  //     order: { id: "ASC" },
  //     take: 7,
  //   });
  // }

  // async paginate(pageOptionsDto: PageOptionsDto): Promise<PageDto<Post>> {

  //   const [posts, total] = await this.postsRepository.findAndCount({
  //     take: pageOptionsDto.take,
  //     where: pageOptionsDto.cursorId ? {
  //       id: LessThan(pageOptionsDto.cursorId),
  //     }: null,
  //     order: {
  //       id: pageOptionsDto.sort.toUpperCase() as any,
  //     },
  //   });

  //   const takePerPage = pageOptionsDto.take;
  //   const isLastPage = total <= takePerPage;

  //   let hasNextData = true;
  //   let cursor: number;

  //   if (isLastPage || posts.length <= 0) {
  //     hasNextData = false;
  //     cursor = null;
  //   } else {
  //     cursor = posts[posts.length - 1].id;
  //   }

  //   const pageMetaDto = new PageMetaDto({ pageOptionsDto, total, hasNextData, cursor });

  //   return new PageDto(posts, pageMetaDto);
  // }
  

  async getPostByCategory(postsCategory: PostCategoryType) {
    return await this.postsRepository.find({
      where: { category: postsCategory, deleted_at: null },
      select: [
        'user_id',
        'title',
        'category',
        'content',
        'created_at',
        'updated_at',
      ],
    });
  }

  async getPostById(post_id: number) {
    return await this.postsRepository.findOne({
      where: { post_id, deleted_at: IsNull() },
      select: [
        'user_id',
        'title',
        'category',
        'content',
        'created_at',
        'updated_at',
      ],
    });
  }

  createPost(
    userId: number,
    title: string,
    category: PostCategoryType,
    content: string
  ) {
    this.postsRepository.insert({
      user_id: userId,
      title,
      category,
      content,
    });
  }

  async updatePost(
    userId: number,
    id: number,
    title: string,
    category: PostCategoryType,
    content: string
  ) {
    const post = await this._existenceCheckById(id);
    this._authorCheckByUserId(post.user_id, userId);

    this.postsRepository.update(id, { title, category, content });
  }


  async deletePost(userId: number, postId: number) {
    const post = await this._existenceCheckById(postId);
    this._authorCheckByUserId(post.user_id, userId);
    this.postsRepository.softDelete(postId);
  }

  private async _existenceCheckById(id: number) {
    const post = await this.postsRepository.findOne({
      where: { post_id: id },
    });
    if (_.isNil(post)) {
      throw new NotFoundException(`Post article not found. id: ${id}`);
    }
    return post;
  }

  private async _authorCheckByUserId(authorId: number, userId: number) {
    if (authorId !== userId) {
      throw new UnauthorizedException(
        `Unauthorized. user id: ${userId} not match with author id: ${authorId}`
      );
    }
  }
}
