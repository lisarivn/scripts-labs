'use client';

import { useEffect, useState } from 'react';


export default function InventoryList() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

    useEffect(() => {
        async function loadItems() {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/inventory`
                );

                const filteredItems = items.filter((item) =>
                    item.name.toLowerCase().includes(search.toLowerCase())
                );

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const payload = await response.json();
                setItems(payload.data ?? []);
            } catch (requestError) {
                console.error('Помилка завантаження даних:', requestError);
                setError('Не вдалося завантажити інвентар');
            } finally {
                setLoading(false);
            }
        }

        loadItems();
    }, []);

    const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
);

    if (loading) return <p>Завантаження інвентарю...</p>;
    if (error) return <p role="alert">{error}</p>;

    return (
        <div className="p-4 border rounded shadow-sm">
            <h2 className="text-xl font-bold mb-4">
                Система інвентаризації
            </h2>

            <input
                type="text"
                placeholder="Пошук товару..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="mb-4 w-full rounded border p-2"
            />

            {filteredItems.length === 0 ? (
                <p>Інвентар порожній.</p>
            ) : (
                <ul className="list-disc pl-5">
                    {filteredItems.map((item) => (
                        <li key={item.id ?? item._id}>
                            {item.name} — <strong>{item.quantity} шт.</strong>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}