import { getCountries } from "@/app/_services/data-service";

// Let's imagine your colleague already built this component 😃

async function SelectCountry({ defaultCountry, name, id, className }) {
  const { data: countries } = await getCountries();

  const flag =
    countries.find((country) => country.name === defaultCountry)?.image_path ??
    "";

  return (
    <select
      name={name}
      id={id}
      // Here we use a trick to encode BOTH the country name and the flag into the value. Then we split them up again later in the server action
      defaultValue={`${defaultCountry}%${flag}`}
      className={className}
    >
      <option value="">Select country...</option>
      {countries.map((c) => (
        <option key={c.name} value={`${c.name}%${c.image_path}`}>
          {c.name}
        </option>
      ))}
    </select>
  );
}

export default SelectCountry;
