import express, { Router } from "express";
import auth from "../middlewares/auth";
import blogService from "../model/services/blogs"

// satisfying typescript static type check
declare global {
    namespace Express {
        interface Request {
           user?: {
                id: string,
                username?: string,
           }
        }
     }
}

const blogs: Router = express.Router();

// need to check for diffrent errors but skipping for now
blogs.get("/blogs", (req, res) => {
    blogService.AllBlogs().then(blogs => {
        res.status(200).json({blogs: blogs, success: true});
    })
    .catch(err => {
        res.status(400).json({error: err.message, success: false});
    })
});

blogs.get("/blogs/:id", (req, res) => {
    blogService.findOneBlog(req.params.id).then(blog => {
        res.status(200).json({blog: blog, success: true});
    })
    .catch(err => {
        res.status(400).send({error: err.message, success: false});
    });
});

blogs.post("/blogs", auth, (req, res) => {
    const {blog} = req.body;
    if (!blog) {
        res.status(400).json({error: "check your input", success: false});
    }

    blogService.newBlog(req.user.id, blog).then(() => {
        res.status(200).json({blog: blog, success: true});
    }).catch(err => {
        res.status(400).json({error: err.message, success: false});
    });
});

blogs.post("/upload", auth, (req, res) => {

});

blogs.put("/blogs", auth, (req, res) => {
    const {blog} = req.body;

    if (!blog || !blog.id) {
        res.status(400).send({error: "check your input", success: false});
    }

    blogService.updateBlog(req.user.id, blog).then(() => {
        res.status(200).json({blog: blog, success: true});
    }).catch(err => {
        console.error(err);
        res.status(400).json({error: err.message, success: false});
    });
});

blogs.delete("/blogs/:id", auth, (req, res) => {
    blogService.deleteBlog(req.user.id, req.params.id).then(id => {
        res.status(200).json({id: req.params.id, success: true});
    }).catch(err => {
        console.error(err);
        res.status(400).json({error: err.message, success: false});
    });
});

export default blogs;