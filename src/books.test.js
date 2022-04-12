import BooksPresenter from "./Books/BooksPresenter";
import Observable from "./Shared/Observable";
import booksRepository from "./Books/BooksRepository";
import httpGateway from "./Shared/HttpGateway";

let getStub = null;
let postStub = null;

beforeEach(() => {
  booksRepository.programmersModel = new Observable([]);
  getStub = {
    success: true,
    result: [
      {
        id: 111,
        name: "Wind in the willows",
        ownerId: "pete@logicroom.co",
        author: "Kenneth Graeme"
      },
      {
        id: 121,
        name: "I, Robot",
        ownerId: "pete@logicroom.co",
        author: "Isaac Asimov"
      },
      {
        id: 131,
        name: "The Hobbit",
        ownerId: "pete@logicroom.co",
        author: "Jrr Tolkein"
      }
    ]
  };

  postStub = {
    success: true,
    result: "book created"
  };

  httpGateway.get = jest.fn().mockImplementation(() => {
    return Promise.resolve(getStub);
  });

  httpGateway.post = jest.fn().mockImplementation(() => {
    return Promise.resolve(postStub);
  });
});

it("should load 3 viewmodel books when 3 books loaded from api", async () => {
  let viewModel = null;
  let booksPresenter = new BooksPresenter();
  await booksPresenter.load((result) => {
    viewModel = result;
  });

  expect(httpGateway.get).toHaveBeenCalledWith(
    "https://api.logicroom.co/api/olakara@gmail.com/books"
  );
  expect(viewModel.length).toBe(3);
  expect(viewModel[0].name).toBe("Wind in the willows");
  expect(viewModel[0].author).toBe("Kenneth Graeme");
  expect(viewModel[1].name).toBe("I, Robot");
  expect(viewModel[1].author).toBe("Isaac Asimov");
});

it("should allow book to be added to api and then viewmodel is updated", async () => {
  let viewModel = null;
  let booksPresenter = new BooksPresenter();
  await booksPresenter.load((result) => {
    viewModel = result;
  });

  //anchor
  expect(viewModel.length).toBe(3);

  //do the pivot
  getStub.result.push({
    id: 141,
    name: "A sample",
    ownerId: "olakara@gmail.com",
    author: "Abdel"
  });

  //add the book
  await booksPresenter.addBook("A sample", "Abdel");
  expect(httpGateway.post).toHaveBeenCalledWith(
    "https://api.logicroom.co/api/olakara@gmail.com/books",
    {
      author: "Abdel",
      name: "A sample",
      ownerId: "olakara@gmail.com"
    }
  );

  console.log(viewModel[3]);
  expect(viewModel.length).toBe(4);
  expect(viewModel[1].name).toBe("I, Robot");
  expect(viewModel[1].author).toBe("Isaac Asimov");
  expect(viewModel[3].name).toBe("A sample");
  expect(viewModel[3].author).toBe("Abdel");
});
