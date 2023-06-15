export interface Post {
    id:string;
    title: string;
    content: string;
    category: string;
    date: Date;
    numberOfViews: number;
    authorUsername: string;
    approved: boolean;
    authorImage: string;
    likes: string[];
}

export class Post implements Post {
    constructor(post : PostForm ){
        Object.assign(this,post);
    }
    


}

export class PostForm {
    id?:string = undefined;
    title:string = '';
    content:string = '';
    category: string = '';
    numberOfViews:number = 0;
    likes: string[] = [];

    constructor(post? : Post){
        if(post){
            this.id = post.id;
            this.title = post.title;
            this.content = post.content;
            this.category = post.category;
           this.numberOfViews = post.numberOfViews;
        }
    }
}
