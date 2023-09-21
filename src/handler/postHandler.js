const https = require("https");
const postHandler = {};

postHandler.getAllPost = (req, res) => {
  https.get("https://jsonplaceholder.typicode.com/posts", (response) => {
    let data = "";

    response.on("data", (chunk) => {
      data += chunk;
    });

    response.on("end", () => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(data);
    });
  });
};

postHandler.getAllComment = (req, res) => {
  https.get("https://jsonplaceholder.typicode.com/comments", (response) => {
    let data = "";

    response.on("data", (chunk) => {
      data += chunk;
    });

    response.on("end", () => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(data);
    });
  });
};

postHandler.getAllData = (req, res) => {
  const postDataUrl = "https://jsonplaceholder.typicode.com/posts";
  const commentDataUrl = "https://jsonplaceholder.typicode.com/comments";

  const combinedData = {
    posts: [],
  };

  https.get(postDataUrl, (postResponse) => {
    let postData = "";

    postResponse.on("data", (chunk) => {
      postData += chunk;
    });

    postResponse.on("end", () => {
      combinedData.posts = JSON.parse(postData);

      https.get(commentDataUrl, (commentResponse) => {
        let commentData = "";

        commentResponse.on("data", (chunk) => {
          commentData += chunk;
        });

        commentResponse.on("end", () => {
          const comments = JSON.parse(commentData);

          combinedData.posts.forEach((post) => {
            post.comments = comments
              .filter((comment) => comment.postId === post.id)
              .map((comment) => {
                return {
                  postId: comment.postId,
                  namaUser: comment.name,
                };
              });
          });

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(combinedData));
        });
      });
    });
  });
};

module.exports = postHandler;
