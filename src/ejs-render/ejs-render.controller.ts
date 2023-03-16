import { Body, Controller, Get, Param, Query, Render, Req, Res } from '@nestjs/common';
import { CreatePostDto } from 'src/posts/dto/create-post.dto';
import { PostsService } from 'src/posts/posts.service';
import { RequestsService } from 'src/requests/requests.service';
import { MessagesService } from 'src/messages/messages.service'
@Controller()
export class EjsRenderController {
  constructor(
    private readonly requestsService: RequestsService,
    private readonly postsService: PostsService,
    private readonly messagesService: MessagesService
  ) {}

  @Get('/')
  @Render('index')
  async main(@Req() req) {
    console.log('/ GET, req.userId: ', req.userId);
    const requests = await this.requestsService.getRequests();
    return {
      components: 'main',
      userId: req.userId,
      requests: requests.slice(0, 6),
    };
  }

  @Get('/signUp')
  @Render('index')
  signUp(@Req() req){
    return { components: 'signUp', userId: req.userId  };
  }

  @Get('/user/mypage')
  @Render('index')
  myPage(@Req() req) {
    return { components: 'myPage', user: req.user };
  }

  @Get('')
  @Render('index')
  admin(@Req() req) {
    return { components: 'admin' };
  }

  @Get('/login')
  @Render('index')
  login(@Req() req) {
    return { components: 'login', userId: req.userId };
  }


  @Get('/request/list')
  @Render('index')
  async requestList(@Req() req) {
    const requests = await this.requestsService.getRequests();
    return { components: 'requestList', userId: req.userId, requests };
  }

  @Get('requestDetail/:id')
  @Render('index')
  async requestDetail(@Param('id') id: number, @Req() req) {
    const request = await this.requestsService.getRequestById(id);
    return {
      components: 'requestDetail',
      userId: req.userId,
      request: request[0],
    };
  }

  @Get('request/post')
  @Render('index')
  requestPost(@Req() req) {
    return { components: 'requestPost', userId: req.userId };
  }

  @Get('')
  @Render('index')
  shareList(@Req() req) {
    return { components: 'shareList' };
  }

  @Get('')
  @Render('index')
  shareDetail(@Req() req) {
    return { components: 'shareDetail' };
  }

  @Get('')
  @Render('index')
  sharePost(@Req() req) {
    return { components: 'sharePost' };
  }

  @Get('boardList')
  @Render('index')
  async boardList(@Req() req, @Query('page') pageNum: number) {
    const posts = await this.postsService.getPosts(pageNum);
    console.log(posts);
    return { components: 'boardList', userId: req.userId, posts };
  }

  @Get('boardDetail/:id')
  @Render('index')
  async boardDetail(@Req() req, @Param('id') postId: number) {
    const post = await this.postsService.getPostById(postId);
    return { components: 'boardDetail', userId: req.userId, post };
  }

  //글쓰기버튼을 누르면 글쓰기페이지가 나오게
  @Get('boardWrite')
  @Render('index')
  boardWrite(@Req() req) {
    // 카테고리 값을 글쓰기창 페이지 select에 넘기고 싶은데 값을 가져오는 방법을 모르겠음
    return { components: 'boardWrite', userId: req.userId };
  }
  
  //작성완료 버튼을 누르면 아래가 실행되어야 함
  @Get('boardPost')
  @Render('index')
  async boardPost(@Req() req, @Body() data: CreatePostDto) {
    const wirtePost = await this.postsService.createPost(req.userId, data.title, data.category, data.content );
    console.log("넘어옴");
    return { components: 'boardPost', wirtePost };
  }

  @Get('/message/:type')
  @Render('index')
  async receivedMessages(@Req() req,@Param('type') messageType:string) {
    let messages
    if(messageType=='received'){
      messages = await this.messagesService.getReceivedMessages(req.userId);
    } else if(messageType=='sent'){
      messages = await this.messagesService.getSentMessages(req.userId);
    } else{
      messages = await this.messagesService.getUnreadMessages(req.userId);
    }

    return { components: 'message', userId: req.userId, messages };
  }
}
