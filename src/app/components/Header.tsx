// components/Header.js
import { FaSearch, FaList, FaThLarge } from 'react-icons/fa';

export default function Header() {
  return (
    <header className="flex items-center justify-between p-5 bg-white shadow-md rounded-3xl">
      <input
        type="text"
        placeholder="Search"
        className="px-4 py-2 border rounded-lg w-1/3"
      />
      <div className="flex items-center space-x-4">
        <p>Monday, 6th March</p>
        <button className="p-2 rounded-lg border"><FaThLarge /></button>
        <button className="p-2 rounded-lg border"><FaList /></button>
      </div>
    </header>
  );
}
