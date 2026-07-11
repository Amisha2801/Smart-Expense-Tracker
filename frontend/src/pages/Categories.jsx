import { useCallback, useEffect, useState } from "react";
import { createCategory, deleteCategory, getCategories } from "../api/budgetApi";
import {
  Tags, GripVertical, Plus, Info,
  ShoppingCart, Utensils, Car, House, Zap, Repeat,
  ShoppingBag, Clapperboard, Briefcase, Laptop, Gift, Trash2,
} from "lucide-react";
import {
  Button, Dialog, TextField, SegmentedControl, StatusBanner,
} from "../design-system/components";
import "./Categories.css";

const COLOR_OPTIONS = [
  { label: "Green",  value: "#3f6f4f" },
  { label: "Orange", value: "#c26a3d" },
  { label: "Blue",   value: "#4a6b8a" },
  { label: "Purple", value: "#8a6d9a" },
  { label: "Amber",  value: "#b08a2e" },
  { label: "Olive",  value: "#5f6f5a" },
  { label: "Teal",   value: "#3f8078" },
  { label: "Mauve",  value: "#a05a7a" },
];

function guessIcon(name = "") {
  const n = name.toLowerCase();
  if (n.includes("grocer") || n.includes("market")) return ShoppingCart;
  if (n.includes("din") || n.includes("food") || n.includes("restaurant") || n.includes("cafe")) return Utensils;
  if (n.includes("trans") || n.includes("car") || n.includes("gas") || n.includes("fuel")) return Car;
  if (n.includes("hous") || n.includes("rent") || n.includes("home") || n.includes("mortgage")) return House;
  if (n.includes("util")) return Zap;
  if (n.includes("sub") || n.includes("netflix") || n.includes("spotify")) return Repeat;
  if (n.includes("shop") || n.includes("amazon")) return ShoppingBag;
  if (n.includes("fun") || n.includes("entertain") || n.includes("movie")) return Clapperboard;
  if (n.includes("salary") || n.includes("job") || n.includes("work")) return Briefcase;
  if (n.includes("freelance") || n.includes("side") || n.includes("consult")) return Laptop;
  if (n.includes("gift") || n.includes("other") || n.includes("misc")) return Gift;
  return Tags;
}

function CategoryRow({ category, onDelete }) {
  const Icon = guessIcon(category.name);
  return (
    <div className="cat-row">
      <GripVertical size={15} className="cat-row__grip" />
      <span className="cat-row__icon" style={{ color: category.color }}>
        <Icon size={16} />
      </span>
      <span className="cat-row__name">{category.name}</span>
      <span className="cat-row__swatch" style={{ background: category.color }} />
      <button
        type="button"
        className="cat-row__delete"
        onClick={() => onDelete(category.id)}
        title="Delete"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

function Categories() {
  const [categories, setCategories] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [kind, setKind] = useState("expense");
  const [color, setColor] = useState(COLOR_OPTIONS[0].value);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadCategories = useCallback(async () => {
    try {
      const data = await getCategories();
      if (data.error) { setError(data.error); return; }
      setCategories(data.data || []);
    } catch {
      setError("Unable to load categories.");
    }
  }, []);

  useEffect(() => { loadCategories(); }, [loadCategories]);

  const resetForm = () => {
    setName("");
    setKind("expense");
    setColor(COLOR_OPTIONS[0].value);
    setError("");
    setMessage("");
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) { setError("Category name is required."); return; }
    try {
      setError(""); setMessage("");
      const data = await createCategory({ name: name.trim(), kind, color, icon: "💰" });
      if (data.error) { setError(data.error); return; }
      setMessage("Category created.");
      resetForm();
      setDialogOpen(false);
      await loadCategories();
    } catch {
      setError("Unable to create category.");
    }
  };

  const handleDelete = async (id) => {
    try {
      setError(""); setMessage("");
      const data = await deleteCategory(id);
      if (data && data.error) { setError(data.error); return; }
      setMessage("Category deleted.");
      await loadCategories();
    } catch {
      setError("Unable to delete category.");
    }
  };

  const expenseCategories = categories.filter(c => c.kind === "expense");
  const incomeCategories  = categories.filter(c => c.kind === "income");

  return (
    <div className="page">
      <div className="cat-page-header">
        <div>
          <h1>Categories</h1>
          <p className="cat-page-header__sub">Organize spending &amp; income · drag to reorder</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => { resetForm(); setDialogOpen(true); }}>
          New category
        </Button>
      </div>

      <StatusBanner error={error} message={message} />

      <div className="cat-columns">
        {/* Expense column */}
        <div>
          <div className="cat-column-header">
            <span className="cat-column-header__dot cat-column-header__dot--neg" />
            <h2>Expense</h2>
            <span className="cat-column-header__count">{expenseCategories.length} categories</span>
          </div>
          {expenseCategories.length === 0 ? (
            <div className="cat-empty">No expense categories yet.</div>
          ) : (
            <div className="cat-list">
              {expenseCategories.map(cat => (
                <CategoryRow key={cat.id} category={cat} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>

        {/* Income column */}
        <div>
          <div className="cat-column-header">
            <span className="cat-column-header__dot cat-column-header__dot--pos" />
            <h2>Income</h2>
            <span className="cat-column-header__count">{incomeCategories.length} categories</span>
          </div>
          {incomeCategories.length === 0 ? (
            <div className="cat-empty">No income categories yet.</div>
          ) : (
            <div className="cat-list">
              {incomeCategories.map(cat => (
                <CategoryRow key={cat.id} category={cat} onDelete={handleDelete} />
              ))}
            </div>
          )}
          <div className="cat-tip">
            <Info size={17} className="cat-tip__icon" />
            <p>
              Each category can carry a color and icon used across charts, tags, and budget bars.
              Nest child categories under a parent to roll spending up automatically.
            </p>
          </div>
        </div>
      </div>

      <Dialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); resetForm(); }}
        title="New category"
      >
        <form className="stacked-form" onSubmit={handleCreate}>
          <TextField
            label="Name"
            type="text"
            placeholder="e.g. Groceries"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <div>
            <label className="cat-ds-label">Type</label>
            <SegmentedControl
              ariaLabel="Category type"
              value={kind}
              onChange={setKind}
              options={[
                { value: "expense", label: "Expense" },
                { value: "income", label: "Income" },
              ]}
            />
          </div>

          <div>
            <label className="cat-ds-label">Color</label>
            <div className="cat-color-grid">
              {COLOR_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  className={`cat-color-swatch${color === opt.value ? " cat-color-swatch--active" : ""}`}
                  style={{ background: opt.value }}
                  onClick={() => setColor(opt.value)}
                  title={opt.label}
                />
              ))}
            </div>
          </div>

          <div className="ds-dialog__footer">
            <Button
              type="button"
              variant="secondary"
              onClick={() => { setDialogOpen(false); resetForm(); }}
            >
              Cancel
            </Button>
            <Button type="submit">Create category</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}

export default Categories;
