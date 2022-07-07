const { nanoid } = require('nanoid');

//file
const books = require('./books')

const addBookHandler = (request, h) => {

    const { name, year, author, summary, publisher,pageCount,readPage, reading,} = request.payload;

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    if (!name){
        const response = h.response({
                status: 'fail',
                message: 'Gagal menambahkan buku. Mohon isi nama buku',
            })
            .code(400);
            return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        })
        .code(400);
        return response;
    } 

    const addnew = {id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt};
    books.push(addnew);

    const isSuccess = books.filter((note) => note.id === id).length > 0;

    if (isSuccess) {       
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
              bookId: id,
            },
          })
          .code(201);
        return response;
      }
    
      const response = h.response({
          status: 'fail',
          message: 'Buku gagal ditambahkan',
        })
        .code(500);
      return response;
};

const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;
  
    if (!name && !reading && !finished) {
      const response = h.response({
          status: 'success',
          data: {
            books: books.map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            })),
          },
        })
        .code(200);
      return response;
    }
  
    if (name){
      const Name=name.toLowerCase();
      const filterbyname = books.filter((book) => book.name.toLowerCase().includes(Name));
      const response=h.response({
      status:'success',
        data:{
          books:filterbyname.map((book)=>({
            id:book.id,
            name:book.name,
            publisher:book.publisher
          }))
        }
      });
      response.code(200);
      return response;
    }
  
    if (reading) {
      const filterbyReading = books.filter(
        (book) => Number(book.reading) === Number(reading),
      );
  
      const response = h.response({
          status: 'success',
          data: {
            books: filterbyReading.map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            })),
          },
        })
        .code(200);
  
      return response;
    }
  
    const filterbyFinish = books.filter(
      (book) => Number(book.finished) === Number(finished),
    );
  
    const response = h
      .response({
        status: 'success',
        data: {
          books: filterbyFinish.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      })
      .code(200);
  
    return response;
  };

const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const book = books.filter((n) => n.id === bookId)[0];

    if (book) {
      const response = h.response({
            status: 'success',
            data: {
              book,
            },
          })
          .code(200);
          return response;
        }

        const response = h.response({
          status: 'fail',
          message: 'Buku tidak ditemukan',
        })
        response.code(404);
        return response;
};


const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const {name, year, author, summary, publisher, pageCount, readPage, reading,} = request.payload;

      if (!name) {        
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
          })
          .code(400);
        return response;
      }
    
      if (readPage > pageCount) {
        
        const response = h.response({
            status: 'fail',
            message:
              'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
          })
          .code(400);
        return response;
      }

    const finished = pageCount === readPage;
    const updatedAt = new Date().toISOString();

    const index = books.findIndex((note) => note.id === bookId);

    if (index !== -1) {
        books[index] = {
          ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            finished,
            updatedAt,    
        };

        const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      })
      .code(200);
    return response;
  }

  const response = h
    .response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    })
    .code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const index = books.findIndex((note) => note.id === bookId);

    if (index !== -1) {
        books.splice(index, 1);

        const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      })
      .code(200);
    return response;
    }
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    })
    .code(404);
  return response;
};

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };