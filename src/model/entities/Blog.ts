import User from "./User";

type Blog =  {
    id: any;
    title: String;
    content: String;
    category: String;
    cover: Number;
    author: User;
}

export default Blog;