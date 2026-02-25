import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";

const db = new Database("erva_na_medida.db");

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS strains (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    thc REAL,
    cbd REAL,
    terpenes TEXT,
    effects TEXT,
    notes TEXT
  );

  CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    ingredients TEXT NOT NULL, -- JSON array
    instructions TEXT NOT NULL,
    cannabis_amount REAL,
    cannabis_thc REAL,
    servings INTEGER,
    thc_per_serving REAL,
    cbd_per_serving REAL,
    author TEXT,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS recipe_interactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipe_id INTEGER,
    user_name TEXT,
    rating INTEGER,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(recipe_id) REFERENCES recipes(id)
  );

  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    strain_id INTEGER,
    strain_name TEXT,
    amount REAL,
    thc REAL,
    cbd REAL,
    method TEXT,
    effect_rating INTEGER,
    notes TEXT,
    effects_felt TEXT -- JSON array
  );
`);

const seedRecipes = () => {
  const count = db.prepare("SELECT COUNT(*) as count FROM recipes").get() as { count: number };
  if (count.count > 0) return;

  const recipes = [
    {
      name: "Manteiga Canábica (Cannabutter)",
      description: "A base mais versátil para culinária canábica.",
      ingredients: [{ name: "Manteiga sem sal", amount: 250, unit: "g" }, { name: "Cannabis descarboxilada", amount: 10, unit: "g" }, { name: "Água", amount: 500, unit: "ml" }],
      instructions: "1. Derreta a manteiga com a água em fogo baixo.\n2. Adicione a cannabis.\n3. Cozinhe em banho-maria por 3-4 horas.\n4. Coe com um pano fino e leve à geladeira.",
      cannabis_amount: 10, cannabis_thc: 15, servings: 20, thc_per_serving: 60, author: "Erva na Medida", image_url: "https://picsum.photos/seed/butter/400/300"
    },
    {
      name: "Azeite Canábico",
      description: "Ideal para saladas e pratos mediterrâneos.",
      ingredients: [{ name: "Azeite de Oliva Extra Virgem", amount: 250, unit: "ml" }, { name: "Cannabis descarboxilada", amount: 7, unit: "g" }],
      instructions: "1. Aqueça o azeite e a cannabis em banho-maria.\n2. Mantenha entre 70-90°C por 2 horas.\n3. Coe e armazene em local escuro.",
      cannabis_amount: 7, cannabis_thc: 15, servings: 25, thc_per_serving: 33, author: "Erva na Medida", image_url: "https://picsum.photos/seed/oil/400/300"
    },
    {
      name: "Brownie Clássico",
      description: "O favorito de todos os tempos.",
      ingredients: [{ name: "Manteiga Canábica", amount: 100, unit: "g" }, { name: "Chocolate Meio Amargo", amount: 200, unit: "g" }, { name: "Açúcar", amount: 150, unit: "g" }, { name: "Ovos", amount: 3, unit: "un" }, { name: "Farinha", amount: 100, unit: "g" }],
      instructions: "1. Derreta o chocolate com a manteiga.\n2. Bata os ovos com açúcar.\n3. Misture tudo e asse a 180°C por 25 min.",
      cannabis_amount: 5, cannabis_thc: 15, servings: 12, thc_per_serving: 50, author: "Chef Weed", image_url: "https://picsum.photos/seed/brownie/400/300"
    },
    {
      name: "Gomas de Frutas",
      description: "Doces e potentes, fáceis de dosar.",
      ingredients: [{ name: "Suco de fruta", amount: 150, unit: "ml" }, { name: "Gelatina sem sabor", amount: 30, unit: "g" }, { name: "Tintura ou Óleo Canábico", amount: 10, unit: "ml" }],
      instructions: "1. Misture o suco e a gelatina.\n2. Aqueça sem ferver.\n3. Adicione o óleo, misture bem e coloque em moldes.",
      cannabis_amount: 2, cannabis_thc: 15, servings: 30, thc_per_serving: 8, author: "Candy Master", image_url: "https://picsum.photos/seed/gummy/400/300"
    },
    {
      name: "Mel Canábico",
      description: "Adoçante natural com um toque especial.",
      ingredients: [{ name: "Mel", amount: 200, unit: "g" }, { name: "Óleo de Coco Canábico", amount: 20, unit: "g" }],
      instructions: "1. Aqueça o mel levemente.\n2. Misture o óleo de coco canábico até ficar homogêneo.",
      cannabis_amount: 2, cannabis_thc: 15, servings: 20, thc_per_serving: 12, author: "Natureza", image_url: "https://picsum.photos/seed/honey/400/300"
    },
    {
      name: "Guacamole Especial",
      description: "Acompanhamento perfeito para nachos.",
      ingredients: [{ name: "Abacate", amount: 2, unit: "un" }, { name: "Azeite Canábico", amount: 15, unit: "ml" }, { name: "Tomate/Cebola/Coentro", amount: 1, unit: "qs" }],
      instructions: "1. Amasse os abacates.\n2. Adicione os temperos e o azeite canábico.\n3. Misture bem e sirva fresco.",
      cannabis_amount: 0.5, cannabis_thc: 15, servings: 4, thc_per_serving: 15, author: "Fiesta", image_url: "https://picsum.photos/seed/guac/400/300"
    },
    {
      name: "Café Bulletproof Canábico",
      description: "Energia e foco para começar o dia.",
      ingredients: [{ name: "Café quente", amount: 250, unit: "ml" }, { name: "Manteiga Canábica", amount: 5, unit: "g" }, { name: "Óleo de Coco", amount: 5, unit: "ml" }],
      instructions: "1. Prepare o café.\n2. Bata no liquidificador com a manteiga e o óleo até espumar.",
      cannabis_amount: 0.3, cannabis_thc: 15, servings: 1, thc_per_serving: 36, author: "Biohacker", image_url: "https://picsum.photos/seed/coffee/400/300"
    },
    {
      name: "Pesto de Manjericão",
      description: "Molho clássico para massas.",
      ingredients: [{ name: "Manjericão fresco", amount: 50, unit: "g" }, { name: "Azeite Canábico", amount: 50, unit: "ml" }, { name: "Nozes/Pinhões", amount: 30, unit: "g" }, { name: "Parmesão", amount: 30, unit: "g" }],
      instructions: "1. Processe o manjericão, nozes e queijo.\n2. Adicione o azeite canábico aos poucos até dar o ponto.",
      cannabis_amount: 1, cannabis_thc: 15, servings: 4, thc_per_serving: 30, author: "Pasta Lover", image_url: "https://picsum.photos/seed/pesto/400/300"
    },
    {
      name: "Cookies de Chocolate",
      description: "Crocantes por fora, macios por dentro.",
      ingredients: [{ name: "Manteiga Canábica", amount: 100, unit: "g" }, { name: "Açúcar Mascavo", amount: 100, unit: "g" }, { name: "Farinha", amount: 200, unit: "g" }, { name: "Gotas de Chocolate", amount: 100, unit: "g" }],
      instructions: "1. Bata a manteiga com açúcar.\n2. Adicione farinha e gotas.\n3. Asse pequenas bolas a 180°C por 12 min.",
      cannabis_amount: 4, cannabis_thc: 15, servings: 20, thc_per_serving: 24, author: "Cookie Monster", image_url: "https://picsum.photos/seed/cookies/400/300"
    },
    {
      name: "Chá Relaxante",
      description: "Perfeito para antes de dormir.",
      ingredients: [{ name: "Saco de chá (Camomila)", amount: 1, unit: "un" }, { name: "Leite Integral ou de Coco", amount: 50, unit: "ml" }, { name: "Manteiga Canábica", amount: 2, unit: "g" }],
      instructions: "1. Prepare o chá.\n2. Adicione o leite e a manteiga canábica.\n3. Misture bem para emulsionar.",
      cannabis_amount: 0.2, cannabis_thc: 15, servings: 1, thc_per_serving: 24, author: "Zen", image_url: "https://picsum.photos/seed/tea/400/300"
    },
    {
      name: "Mac and Cheese Infundido",
      description: "Conforto em forma de massa e queijo.",
      ingredients: [{ name: "Macarrão", amount: 250, unit: "g" }, { name: "Manteiga Canábica", amount: 30, unit: "g" }, { name: "Queijo Cheddar", amount: 150, unit: "g" }, { name: "Leite", amount: 100, unit: "ml" }],
      instructions: "1. Cozinhe o macarrão.\n2. Faça um molho com a manteiga, leite e queijo.\n3. Misture tudo.",
      cannabis_amount: 1.5, cannabis_thc: 15, servings: 3, thc_per_serving: 60, author: "Comfort Food", image_url: "https://picsum.photos/seed/mac/400/300"
    },
    {
      name: "Hummus Canábico",
      description: "Snack saudável e prático.",
      ingredients: [{ name: "Grão de bico cozido", amount: 400, unit: "g" }, { name: "Tahine", amount: 2, unit: "colheres" }, { name: "Azeite Canábico", amount: 30, unit: "ml" }],
      instructions: "1. Bata tudo no processador até ficar liso.\n2. Ajuste o sal e limão.",
      cannabis_amount: 0.8, cannabis_thc: 15, servings: 6, thc_per_serving: 16, author: "Healthy", image_url: "https://picsum.photos/seed/hummus/400/300"
    },
    {
      name: "Xarope Simples Canábico",
      description: "Para coquetéis e bebidas geladas.",
      ingredients: [{ name: "Água", amount: 200, unit: "ml" }, { name: "Açúcar", amount: 200, unit: "g" }, { name: "Glicerina Vegetal Canábica", amount: 20, unit: "ml" }],
      instructions: "1. Ferva a água com açúcar até dissolver.\n2. Adicione a glicerina canábica e misture.",
      cannabis_amount: 2, cannabis_thc: 15, servings: 20, thc_per_serving: 12, author: "Mixologist", image_url: "https://picsum.photos/seed/syrup/400/300"
    },
    {
      name: "Molho de Pimenta Infundido",
      description: "Para quem gosta de calor.",
      ingredients: [{ name: "Pimentas variadas", amount: 100, unit: "g" }, { name: "Vinagre", amount: 50, unit: "ml" }, { name: "Azeite Canábico", amount: 20, unit: "ml" }],
      instructions: "1. Bata as pimentas com vinagre.\n2. Adicione o azeite canábico e misture bem.",
      cannabis_amount: 0.5, cannabis_thc: 15, servings: 10, thc_per_serving: 6, author: "Spicy", image_url: "https://picsum.photos/seed/hot/400/300"
    },
    {
      name: "Barrinhas de Arroz (Rice Krispie)",
      description: "Clássico infantil, versão adulta.",
      ingredients: [{ name: "Cereal de arroz", amount: 150, unit: "g" }, { name: "Marshmallows", amount: 250, unit: "g" }, { name: "Manteiga Canábica", amount: 50, unit: "g" }],
      instructions: "1. Derreta marshmallows com manteiga.\n2. Misture o cereal.\n3. Pressione em uma forma e deixe esfriar.",
      cannabis_amount: 3, cannabis_thc: 15, servings: 15, thc_per_serving: 24, author: "Retro", image_url: "https://picsum.photos/seed/krispie/400/300"
    },
    {
      name: "Vinagrete Canábico",
      description: "Transforme qualquer salada.",
      ingredients: [{ name: "Vinagre Balsâmico", amount: 30, unit: "ml" }, { name: "Mostarda", amount: 1, unit: "colher" }, { name: "Azeite Canábico", amount: 60, unit: "ml" }],
      instructions: "1. Misture o vinagre e mostarda.\n2. Adicione o azeite canábico em fio, batendo sempre.",
      cannabis_amount: 1.5, cannabis_thc: 15, servings: 8, thc_per_serving: 22, author: "Salad Fan", image_url: "https://picsum.photos/seed/vinaigrette/400/300"
    },
    {
      name: "Cápsulas de Óleo de Coco",
      description: "Dosagem medicinal precisa e discreta.",
      ingredients: [{ name: "Óleo de Coco Canábico", amount: 50, unit: "ml" }, { name: "Cápsulas vazias", amount: 50, unit: "un" }],
      instructions: "1. Use uma seringa para encher as cápsulas com o óleo.\n2. Feche e armazene na geladeira.",
      cannabis_amount: 5, cannabis_thc: 15, servings: 50, thc_per_serving: 12, author: "Med", image_url: "https://picsum.photos/seed/capsule/400/300"
    },
    {
      name: "Molho de Tomate Infundido",
      description: "Para pizzas e massas.",
      ingredients: [{ name: "Tomate pelado", amount: 400, unit: "g" }, { name: "Cebola/Alho", amount: 1, unit: "qs" }, { name: "Azeite Canábico", amount: 20, unit: "ml" }],
      instructions: "1. Refogue cebola e alho.\n2. Adicione tomates e cozinhe.\n3. Finalize com o azeite canábico.",
      cannabis_amount: 0.6, cannabis_thc: 15, servings: 4, thc_per_serving: 18, author: "Italian", image_url: "https://picsum.photos/seed/tomato/400/300"
    },
    {
      name: "Óleo de Coco Canábico",
      description: "Base potente para culinária e uso tópico.",
      ingredients: [{ name: "Óleo de Coco", amount: 250, unit: "ml" }, { name: "Cannabis descarboxilada", amount: 15, unit: "g" }],
      instructions: "1. Aqueça o óleo e cannabis em banho-maria por 4-6 horas.\n2. Coe e armazene.",
      cannabis_amount: 15, cannabis_thc: 15, servings: 50, thc_per_serving: 36, author: "Erva na Medida", image_url: "https://picsum.photos/seed/coconut/400/300"
    },
    {
      name: "Gomas Veganas",
      description: "Sem produtos de origem animal.",
      ingredients: [{ name: "Suco de fruta", amount: 150, unit: "ml" }, { name: "Ágar-ágar", amount: 10, unit: "g" }, { name: "Óleo Canábico", amount: 10, unit: "ml" }],
      instructions: "1. Ferva o suco com ágar-ágar por 2 min.\n2. Adicione o óleo e coloque nos moldes.",
      cannabis_amount: 1, cannabis_thc: 15, servings: 20, thc_per_serving: 6, author: "Vegan", image_url: "https://picsum.photos/seed/vegangummy/400/300"
    }
  ];

  const insert = db.prepare(`
    INSERT INTO recipes (name, description, ingredients, instructions, cannabis_amount, cannabis_thc, servings, thc_per_serving, author, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const r of recipes) {
    insert.run(r.name, r.description, JSON.stringify(r.ingredients), r.instructions, r.cannabis_amount, r.cannabis_thc, r.servings, r.thc_per_serving, r.author, r.image_url);
  }
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  seedRecipes();

  // API Routes - Strains
  app.get("/api/strains", (req, res) => {
    const strains = db.prepare("SELECT * FROM strains").all();
    res.json(strains.map(s => ({
      ...s,
      terpenes: JSON.parse(s.terpenes || "[]"),
      effects: JSON.parse(s.effects || "[]")
    })));
  });

  app.post("/api/strains", (req, res) => {
    const { name, type, thc, cbd, terpenes, effects, notes } = req.body;
    const info = db.prepare(
      "INSERT INTO strains (name, type, thc, cbd, terpenes, effects, notes) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).run(name, type, thc, cbd, JSON.stringify(terpenes), JSON.stringify(effects), notes);
    res.json({ id: info.lastInsertRowid });
  });

  // API Routes - Logs
  app.get("/api/logs", (req, res) => {
    const logs = db.prepare("SELECT * FROM logs ORDER BY timestamp DESC LIMIT 50").all();
    res.json(logs.map(l => ({
      ...l,
      effects_felt: JSON.parse(l.effects_felt || "[]")
    })));
  });

  app.post("/api/logs", (req, res) => {
    const { strain_id, strain_name, amount, thc, cbd, method, effect_rating, notes, effects_felt } = req.body;
    const info = db.prepare(
      "INSERT INTO logs (strain_id, strain_name, amount, thc, cbd, method, effect_rating, notes, effects_felt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).run(strain_id, strain_name, amount, thc, cbd, method, effect_rating, notes, JSON.stringify(effects_felt));
    res.json({ id: info.lastInsertRowid });
  });

  // API Routes - Recipes
  app.get("/api/recipes", (req, res) => {
    const recipes = db.prepare("SELECT * FROM recipes ORDER BY created_at DESC").all();
    res.json(recipes.map(r => ({
      ...r,
      ingredients: JSON.parse(r.ingredients || "[]")
    })));
  });

  app.get("/api/recipes/:id", (req, res) => {
    const recipe = db.prepare("SELECT * FROM recipes WHERE id = ?").get(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    
    const interactions = db.prepare("SELECT * FROM recipe_interactions WHERE recipe_id = ?").all(req.params.id);
    res.json({ 
      ...recipe, 
      ingredients: JSON.parse(recipe.ingredients || "[]"),
      interactions 
    });
  });

  app.post("/api/recipes", (req, res) => {
    const { name, description, ingredients, instructions, cannabis_amount, cannabis_thc, servings, thc_per_serving, cbd_per_serving, author, image_url } = req.body;
    const info = db.prepare(
      `INSERT INTO recipes (name, description, ingredients, instructions, cannabis_amount, cannabis_thc, servings, thc_per_serving, cbd_per_serving, author, image_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(name, description, JSON.stringify(ingredients), instructions, cannabis_amount, cannabis_thc, servings, thc_per_serving, cbd_per_serving, author, image_url);
    res.json({ id: info.lastInsertRowid });
  });

  app.post("/api/recipes/:id/interact", (req, res) => {
    const { user_name, rating, comment } = req.body;
    const info = db.prepare(
      "INSERT INTO recipe_interactions (recipe_id, user_name, rating, comment) VALUES (?, ?, ?, ?)"
    ).run(req.params.id, user_name, rating, comment);
    res.json({ id: info.lastInsertRowid });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
