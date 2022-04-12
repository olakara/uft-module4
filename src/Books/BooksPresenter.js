import booksRepository from "./BooksRepository.js";

export default class BooksPresenter {
  load = async (callback) => {
    await booksRepository.getBooks((booksPm) => {
      const booksVm = booksPm.map((bookPm) => {
        return { name: bookPm.name, author: bookPm.author };
      });
      callback(booksVm);
    });
  };

  addBook = async (name, author) => {
    const bookPm = {
      name: name,
      author: author,
      ownerId: "olakara@gmail.com"
    };
    await booksRepository.addBook(bookPm);
  };
}
