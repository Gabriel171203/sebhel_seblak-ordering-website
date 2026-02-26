export type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    customizable: boolean;
};

export const products: Product[] = [
    // PAKET SEBLAK
    {
        id: 'p1',
        name: 'Paket Basic',
        description: 'Kerupuk mawar, kerupuk kemplang, mie.',
        price: 10000,
        image: '/images/products/seblakbasic.jpeg',
        category: 'Paket Seblak',
        customizable: true,
    },
    {
        id: 'p2',
        name: 'Paket Komplit',
        description: 'Semua Topping Lengkap + Gratis Minuman (Es Teh/Jeruk/Es Coklat).',
        price: 35000,
        image: '/images/products/seblakkomplit.webp',
        category: 'Paket Seblak',
        customizable: true,
    },

    // ANEKA TOPING
    { id: 't1', name: 'Kerupuk Mawar', description: 'Topping', price: 1000, image: '/images/products/kerupukputih.jpeg', category: 'Topping', customizable: false },
    { id: 't2', name: 'Kerupuk Kemplang', description: 'Topping', price: 1000, image: '/images/products/kerupukoren.jpeg', category: 'Topping', customizable: false },
    { id: 't3', name: 'Kerupuk Bawang', description: 'Topping', price: 1000, image: '/images/products/kerupukwarnawarni.jpeg', category: 'Topping', customizable: false },
    { id: 't4', name: 'Mie', description: 'Topping', price: 2000, image: '/images/products/mie.jpeg', category: 'Topping', customizable: false },
    { id: 't5', name: 'Bakso Daging', description: 'Topping', price: 1000, image: '/images/products/bakso.jpeg', category: 'Topping', customizable: false },
    { id: 't6', name: 'Basreng', description: 'Topping', price: 1000, image: '/images/products/basreng.jpeg', category: 'Topping', customizable: false },
    { id: 't7', name: 'Sosis', description: 'Topping', price: 2000, image: '/images/products/sosis.jpeg', category: 'Topping', customizable: false },
    { id: 't8', name: 'Chikuwa', description: 'Topping', price: 1500, image: '/images/products/chikuwa.jpeg', category: 'Topping', customizable: false },
    { id: 't9', name: 'Cuanki Lidah Panjang', description: 'Topping', price: 1500, image: '/images/products/cuankilidahpanjang.jpeg', category: 'Topping', customizable: false },
    { id: 't10', name: 'Siomay Kering', description: 'Topping', price: 1000, image: '/images/products/siomaykering.jpeg', category: 'Topping', customizable: false },
    { id: 't11', name: 'Twister', description: 'Topping', price: 2000, image: '/images/products/twister.jpeg', category: 'Topping', customizable: false },
    { id: 't12', name: 'Fish Ball', description: 'Topping', price: 1000, image: '/images/products/fishball.jpeg', category: 'Topping', customizable: false },
    { id: 't13', name: 'Dumpling Keju', description: 'Topping', price: 2000, image: '/images/products/dumplingcheese.jpeg', category: 'Topping', customizable: false },
    { id: 't14', name: 'Dumpling Ayam', description: 'Topping', price: 2000, image: '/images/products/dumplingchicken.jpeg', category: 'Topping', customizable: false },
    { id: 't15', name: 'Ceker', description: 'Topping', price: 3000, image: '/images/products/ceker.jpeg', category: 'Topping', customizable: false },
    { id: 't16', name: 'Telur', description: 'Topping', price: 2500, image: '/images/products/telur.jpeg', category: 'Topping', customizable: false },

    // MINUMAN
    { id: 'd1', name: 'Es Jeruk', description: 'Segar alami.', price: 3000, image: '/images/products/esjeruk.jpeg', category: 'Minuman', customizable: false },
    { id: 'd2', name: 'Es Teh', description: 'Teh manis dingin.', price: 3000, image: '/images/products/esteh.jpeg', category: 'Minuman', customizable: false },
    { id: 'd3', name: 'Es Coklat', description: 'Manis nyoklat.', price: 3000, image: '/images/products/escoklat.jpeg', category: 'Minuman', customizable: false },
];
