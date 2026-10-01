import { useMemo, useState } from "react";
import Alert from "../../components/Alert";
import EmptyState from "../../components/EmptyState";
import Field from "../../components/Field";
import Loading from "../../components/Loading";
import PageHeader from "../../components/PageHeader";
import StarRating, { RatingInput } from "../../components/StarRating";
import { useAsync } from "../../hooks/useAsync";
import { useDebounce } from "../../hooks/useDebounce";
import { getStores, submitRating, updateRating } from "../../services/api";

const SORTS = {
  name: (a, b) => a.name.localeCompare(b.name),
  "rating-desc": (a, b) => Number(b.overall_rating) - Number(a.overall_rating),
  "rating-asc": (a, b) => Number(a.overall_rating) - Number(b.overall_rating),
};

function StoreItem({ store, onRated }) {
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const current = store.user_rating ?? null;
  const selected = draft ?? current;
  const unchanged = selected === current;

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      if (current) await updateRating(store.id, selected);
      else await submitRating(store.id, selected);

      setDraft(null);
      setSaved(true);
      onRated();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <li className="store-item">
      <div>
        <h3 className="store-name">{store.name}</h3>
        <p className="store-address">{store.address}</p>
        <div className="mt-3">
          <StarRating value={store.overall_rating} />
        </div>
      </div>

      <div className="store-rate">
        <span className="rate-label">{current ? "Your rating" : "You have not rated this store"}</span>
        <div className="rate-row">
          <RatingInput
            value={selected}
            onChange={(value) => {
              setDraft(value);
              setSaved(false);
            }}
            disabled={saving}
            label={`Your rating for ${store.name}`}
          />
          <button
            type="button"
            className="btn btn-primary btn-sm"
            disabled={saving || !selected || unchanged}
            onClick={handleSave}
          >
            {saving ? "Saving…" : current ? "Update rating" : "Submit rating"}
          </button>
        </div>
        {saved && <span className="muted" role="status">Rating saved.</span>}
        <Alert>{error}</Alert>
      </div>
    </li>
  );
}

export default function UserStores() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [sort, setSort] = useState("name");
  const debouncedName = useDebounce(name);
  const debouncedAddress = useDebounce(address);

  const { data, error, loading, reload } = useAsync(
    () => getStores({ name: debouncedName.trim(), address: debouncedAddress.trim() }),
    [debouncedName, debouncedAddress],
  );

  const stores = useMemo(
    () => (data ? [...data.data].sort(SORTS[sort]) : []),
    [data, sort],
  );
  const filtering = Boolean(debouncedName.trim() || debouncedAddress.trim());

  return (
    <>
      <PageHeader
        title="Stores"
        description="Search for a store, then rate it from 1 to 5. You can change your rating at any time."
      />

      <div className="filters mb-5">
        <Field
          label="Store name"
          type="search"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Search by name"
        />
        <Field
          label="Address"
          type="search"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder="Search by address"
        />
        <Field as="select" label="Sort by" value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="name">Name, A to Z</option>
          <option value="rating-desc">Highest rated</option>
          <option value="rating-asc">Lowest rated</option>
        </Field>
      </div>

      <Alert>{error}</Alert>
      {!data && loading && <Loading label="Loading stores" />}

      {data && stores.length === 0 && (
        <EmptyState title={filtering ? "No stores match your search" : "No stores yet"}>
          {filtering
            ? "Try a shorter name or a different part of the address."
            : "An administrator has not added any stores. Check back later."}
        </EmptyState>
      )}

      {stores.length > 0 && (
        <ul className="store-list" aria-busy={loading}>
          {stores.map((store) => (
            <StoreItem key={store.id} store={store} onRated={reload} />
          ))}
        </ul>
      )}
    </>
  );
}
