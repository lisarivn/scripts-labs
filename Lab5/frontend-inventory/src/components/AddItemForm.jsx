'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { addInventoryItem } from '@/app/actions/inventory.actions';

const initialState = {
    success: false,
    message: '',
    submittedAt: 0,
};

export default function AddItemForm() {
    const router = useRouter();
    const formRef = useRef(null);

    const [state, formAction, pending] = useActionState(
        addInventoryItem,
        initialState
    );

    useEffect(() => {
        if (state.success) {
            formRef.current?.reset();
            router.refresh();
        }
    }, [state.submittedAt, state.success, router]);

    return (
        <form
            ref={formRef}
            action={formAction}
            className="flex flex-col gap-3 max-w-sm"
        >
            <input
                name="name"
                placeholder="Назва товару"
                required
                className="border rounded px-3 py-2"
            />

            <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="Ціна"
                required
                className="border rounded px-3 py-2"
            />

            <input
                name="quantity"
                type="number"
                min="0"
                step="1"
                placeholder="Кількість"
                required
                className="border rounded px-3 py-2"
            />

            <button
                type="submit"
                disabled={pending}
                className="border rounded px-3 py-2"
            >
                {pending ? 'Додавання...' : 'Додати товар'}
            </button>

            {state.message && (
                <p role={state.success ? 'status' : 'alert'}>
                    {state.message}
                </p>
            )}
        </form>
    );
}