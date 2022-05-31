// console.log('May Node be with you')
// worked with Kewaun
const express = require("express"); // importing the express package
const { render } = require("express/lib/response");
const app = express(); // initializing the express app
app.use(express.urlencoded({ extended: true }));
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = "mongodb+srv://leoconstant:leo@cluster0.ari5v8s.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());

app.listen(3000, function () {
  console.log("listening on 3000"); // listen for the requests on localhost 3000 (it can be anything but on a port where nothing else is running)
});

MongoClient.connect(uri, { useUnifiedTopology: true })
  .then((client) => {
    const db = client.db("star-wars");
    const quotesCollection = db.collection("yoda");
    app.post("/quotes", (req, res) => {
      quotesCollection
        .insertOne(req.body)
        .then((result) => {
          console.log(result);
        })
        .catch((error) => console.error(error));
    });

    app.get("/", (req, res) => {
      client
        .db("star-wars")
        .collection("yoda")
        .find()
        .toArray()
        .then((results) => {
          console.log(results);
          res.render("index.ejs", { quotes: results });
        })
        .catch((error) =>
          res.render("index.ejs", { quotes: "error loading quotes" })
        );
    });

    app.put("/quotes", (req, res) => {
      quotesCollection
        .findOneAndUpdate(
          { name: "Yoda" },
          {
            $set: {
              name: req.body.name,
              quote: req.body.quote,
            },
          },
          {
            upsert: true,
          }
        )
        .then((result) => {
          res.json("Success");
        })
        .catch((error) => console.error(error));
    });

    app.delete("/quotes", (req, res) => {
      quotesCollection.deleteOne(
        { name: req.body.name }
        )
        .then((result) => {
          console.log(result)
          if (result.deletedCount === 0) {
            return res.json("No quote to delete");
          }
          res.json(`Deleted Darth Vadar's quote`);
        })
        .catch((error) => console.error(error));
    });
  })

  .catch(console.error);
