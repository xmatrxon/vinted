import { Paginator } from 'primereact/paginator';
import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';

function VintedFilterList() {
  const borderStyle = {
    border: '1px solid black',
    padding: '5px',
  };

  const [title, setTitle] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [item, setItem] = useState({});
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(48);
  const [pagination, setPagination] = useState({});
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    setIsLoading(true);
    const url = new URL('http://localhost:3001/api');

    url.searchParams.append('title', title);
    url.searchParams.append('sortBy', sortBy);
    url.searchParams.append('priceFrom', priceFrom);
    url.searchParams.append('priceTo', priceTo);
    url.searchParams.append('page', page);

    // Wykonanie żądania HTTP GET
    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then((data) => {
        setItems(data.items);
        setPagination(data.pagination);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Błąd:', error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    handleSearch();
  };

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
    setPage(event.page + 1);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const showDialog = (itemValue) => {
    setItem(itemValue);
    setVisible(true);
  };

  const clear = () => {
    setItems([]);
    setTitle('');
    setSortBy('');
    setPriceFrom('');
    setPriceTo('');

    setFirst(0);
    setRows(48);
    setPage(1);
  };

  useEffect(() => {
    handleSearch();
  }, [page]);

  return (
    <>
      <div className="flex justify-center gap-5 w-3/4 mt-5 mx-auto">
        <div className="w-full">
          <form onSubmit={handleSubmit}>
            <div className="flex gap-5 p-3 bg-gray-200 shadow-lg shadow-slate-500 rounded">
              <div className="flex flex-col w-1/6 pb-3">
                <label className="py-2">Tytuł</label>
                <input
                  type="text"
                  className="border rounded"
                  style={borderStyle}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="flex flex-col w-1/4 pb-3">
                <label className="py-2">Sortowanie według</label>
                <select
                  value={sortBy}
                  className="border rounded"
                  style={borderStyle}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="">Wybierz Sortowanie</option>
                  <option value="relevant">Trafność</option>
                  <option value="price_high_to_low">Cena: od najwyższej</option>
                  <option value="price_low_to_high">Cena: od najniższej</option>
                  <option value="newest_first">Od najnowszych</option>
                  <option value="likes_high_to_low">
                    Ulubione: od najwyższej
                  </option>
                  <option value="likes_low_to_high">
                    Ulubione: od najniższej
                  </option>
                </select>
              </div>
              <div className="flex flex-col w-1/12 pb-3">
                <label className="py-2">Cena od</label>
                <input
                  value={priceFrom}
                  type="text"
                  className="border rounded"
                  style={borderStyle}
                  onChange={(e) => setPriceFrom(e.target.value)}
                />
              </div>
              <div className="flex flex-col w-1/12 pb-3">
                <label className="py-2">Cena do</label>
                <input
                  value={priceTo}
                  type="text"
                  className="border rounded"
                  style={borderStyle}
                  onChange={(e) => setPriceTo(e.target.value)}
                />
              </div>
              <div className="flex flex-grow gap-3 justify-end items-end pb-4">
                <button
                  type="submit"
                  className="bg-teal-600 w-full text-white py-1 rounded"
                >
                  Szukaj
                </button>
                <button
                  type="reset"
                  onClick={() => clear()}
                  className="bg-blue-600 w-full text-white py-1 rounded"
                >
                  Wyczyść
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="flex flex-wrap justify-center w-3/4 mx-auto gap-5 mt-5">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <ProgressSpinner />
          </div>
        ) : (
          items.map((item, index) => (
            <div key={index} className="w-1/6">
              <div className="flex flex-col  p-3 bg-gray-200 shadow-lg shadow-slate-500 rounded">
                <div className="h-2/3">
                  <img
                    src={item?.photo?.full_size_url}
                    className="h-80 object-cover"
                    alt="img"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <h1 className="font-bold">{item?.user?.login}</h1>
                  <h1 className="text-green-800 font-bold">
                    <span className="text-black">Cena: </span>
                    Cena:{' '}
                    {item?.price % 1 === 0 ? `${item?.price}0` : item?.price}
                    zł{' '}
                  </h1>
                  <h1 className="font-bold">
                    <span className="text-red-600">❤️</span>
                    {item?.favourite_count}
                  </h1>
                  <button
                    className="bg-teal-600 mt-2 w-full text-white py-1 rounded"
                    onClick={() => showDialog(item)}
                  >
                    Szczegóły
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="m-5">
        {items.length > 0 && (
          <Paginator
            first={first}
            rows={rows}
            totalRecords={pagination.total_entries}
            onPageChange={onPageChange}
          />
        )}
      </div>

      <Dialog
        header="Szczegóły"
        visible={visible}
        onHide={() => setVisible(false)}
        style={{ display: 'flex' }}
        breakpoints={{ '960px': '75vw', '641px': '100vw' }}
      >
        <div className="flex p-3 bg-gray-200 shadow-lg shadow-slate-500 rounded">
          <div className="h-2/3">
            <img
              src={item?.photo?.full_size_url}
              className="h-80 object-cover"
              alt="img"
            />
          </div>
          <div className="mx-3 flex flex-col justify-between">
            <div className="flex flex-col gap-2 h-full justify-center">
              <h1 className="font-bold">
                Nazwa użytkownika: {item?.user?.login}
              </h1>
              <h1 className="font-bold">Marka: {item?.brand_title}</h1>
              <h1 className="font-bold">
                <span className="text-red-600">❤️</span>
                {item?.favourite_count}
              </h1>
              <h1 className="text-green-800 font-bold">
                Cena: {item?.price % 1 === 0 ? `${item?.price}0` : item?.price}
                zł
              </h1>
            </div>
            <div>
              <button className="bg-teal-600 mt-2 w-full text-white py-1 rounded">
                <a href={item?.url} target="_blank">
                  Przejdź do aukcji
                </a>{' '}
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default VintedFilterList;
