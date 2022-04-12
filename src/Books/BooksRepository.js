import httpGateway from "../Shared/HttpGateway.js";
import Observable from "../Shared/Observable";

class BooksRepository {
  programmersModel = null;
  apiUrl = "https://api.logicroom.co/api/olakara@gmail.com/";

  constructor() {
    this.programmersModel = new Observable([]);
  }

  getBooks = async (callback) => {
    this.programmersModel.subscribe(callback);
    await this.loadApiData();
    this.programmersModel.notify();
  };

  addBook = async (bookPm) => {
    let dto = {
      name: bookPm.name,
      author: bookPm.author,
      ownerId: "olakara@gmail.com"
    };
    await this.postData(dto);
    await this.loadApiData();
    this.programmersModel.notify();
  };

  loadApiData = async () => {
    const booksDto = await httpGateway.get(this.apiUrl + "books");
    this.programmersModel.value = booksDto.result.map((bookDto) => {
      return bookDto;
    });
  };

  postData = async (bookDto) => {
    return await httpGateway.post(this.apiUrl + "books", bookDto);
  };
}

const booksRepository = new BooksRepository();
export default booksRepository;
