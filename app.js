const P = [
	["Brake pads (front set)", "Brakes", 85000, 24, "Toyota Premio, Allion, Corolla", "🛑"],
	["Brake disc (pair)", "Brakes", 160000, 6, "Toyota Harrier, RAV4", "🛑"],
	["Engine oil 5W-30 (4L)", "Oils & Fluids", 95000, 40, "Most petrol engines", "🛢️"],
	["Coolant 5L", "Oils & Fluids", 38000, 0, "All vehicles", "🧪"],
	["Oil filter", "Filters", 18000, 60, "Toyota, Nissan, Honda", "⚙️"],
	["Air filter", "Filters", 25000, 30, "Toyota Hiace, Noah, Premio", "🌀"],
	["Car battery 70Ah", "Electrical", 320000, 9, "Most saloons and SUVs", "🔋"],
	["Spark plugs (set of 4)", "Electrical", 60000, 35, "Toyota 1NZ, 2NZ engines", "⚡"],
	["Headlight bulb pair H4", "Electrical", 30000, 50, "Universal H4 fit", "💡"],
	["Shock absorber (front)", "Suspension", 210000, 5, "Toyota Land Cruiser Prado", "🔩"],
	["Wheel bearing", "Suspension", 75000, 12, "Nissan Note, March", "⭕"],
	["Fan belt", "Engine", 45000, 18, "Toyota Hilux, Fortuner", "➰"],
	["Radiator", "Engine", 380000, 3, "Toyota Hiace", "🌡️"],
	["Seat covers (full set)", "Accessories", 140000, 15, "Saloon cars", "💺"],
	["Floor mats (set of 5)", "Accessories", 55000, 28, "Universal", "🟫"],
	["Phone holder and USB charger", "Accessories", 35000, 44, "Universal", "📱"],
].map((item, index) => ({
	id: index,
	name: item[0],
	cat: item[1],
	price: item[2],
	stock: item[3],
	fits: item[4],
	icon: item[5],
}));

const $ = (selector, root = document) => root.querySelector(selector);
const fmt = (amount) => "UGX " + amount.toLocaleString();

let cart = {};
try {
	cart = JSON.parse(localStorage.getItem("kapac") || "{}");
} catch (error) {}

const save = () => {
	try {
		localStorage.setItem("kapac", JSON.stringify(cart));
	} catch (error) {}
};

const page = location.pathname.split("/").pop() || "index.html";
const nav = [
	["index.html", "Home"],
	["parts.html", "Auto Parts"],
	["about.html", "About Us"],
];

document.body.insertAdjacentHTML(
	"afterbegin",
	`<header>
		<div class="wrap">
			<a class="logo" href="index.html">
				<b>K</b>Kampala Auto Parts<br>&amp; Accessories Centre
			</a>
			<nav>
				${nav
					.map(
						(item) =>
							`<a href="${item[0]}" class="${item[0] == page ? "on" : ""}">${item[1]}</a>`,
					)
					.join("")}
				<button class="btn" id="cartBtn">Basket<span id="cnt">0</span></button>
			</nav>
		</div>
	</header>`,
);

document.body.insertAdjacentHTML(
	"beforeend",
	`<footer>
		<div class="wrap">
			<div class="two">
				<div>
					<h3>Kampala Auto Parts &amp; Accessories Centre</h3>
					<p>Spare parts and accessories for vehicle owners, garages, mechanics and transport companies.</p>
				</div>
				<div>
					<h3>Contact</h3>
					<p>
						Plot 12, Kampala Road, Kampala<br>
						Phone / WhatsApp: +256 700 000 000<br>
						info@kapac.example
					</p>
					<p>Mon–Sat 8:00–18:00</p>
				</div>
				<div>
					<h3>Follow us</h3>
					<a href="#">Facebook</a>
					<a href="#">Instagram</a>
					<a href="#">X / Twitter</a>
					<a href="#">WhatsApp</a>
				</div>
			</div>
			<small>© 2026 Kampala Auto Parts &amp; Accessories Centre. Sample business details for a course project.</small>
		</div>
	</footer>
	<aside id="drawer" aria-label="Basket">
		<div class="hd">
			<h3 id="dt">Your basket</h3>
			<button id="dx" aria-label="Close">×</button>
		</div>
		<div id="dbody"></div>
	</aside>
	<dialog id="dlg"></dialog>`,
);

const count = () => Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
const total = () =>
	Object.entries(cart).reduce((sum, [index, quantity]) => sum + P[index].price * quantity, 0);

function upd() {
	$("#cnt").textContent = count();
	save();
}

function add(index) {
	const product = P[index];

	if (!product.stock) return;

	cart[index] = Math.min((cart[index] || 0) + 1, product.stock);
	upd();
	openD("cart");
}

const stock = (product) =>
	product.stock == 0
		? ["Out of stock", "out"]
		: product.stock <= 6
			? ["Only " + product.stock + " left", "low"]
			: ["In stock", "in"];

const card = (product) => {
	const [availability, statusClass] = stock(product);

	return `<article class="card">
		<div class="pic" aria-hidden="true">${product.icon}</div>
		<div class="bd">
			<span class="cat">${product.cat}</span>
			<h3>${product.name}</h3>
			<span class="price">${fmt(product.price)}</span>
			<span class="tag ${statusClass}">${availability}</span>
			<div class="row">
				<button class="btn sm dark" data-d="${product.id}">Details</button>
				<button class="btn sm" data-a="${product.id}" ${product.stock ? "" : "disabled"}>Add to basket</button>
			</div>
		</div>
	</article>`;
};

document.addEventListener("click", (event) => {
	const target = event.target;

	if (target.dataset.a !== undefined) {
		add(+target.dataset.a);
		$("#dlg").close();
	}

	if (target.dataset.d !== undefined) {
		const product = P[target.dataset.d];
		const [availability, statusClass] = stock(product);

		$("#dlg").innerHTML = `<h2>${product.icon} ${product.name}</h2>
			<p class="cat">${product.cat}</p>
			<p class="price">${fmt(product.price)}</p>
			<p><b>Availability:</b> <span class="tag ${statusClass}">${availability}</span></p>
			<p><b>Suitable for:</b> ${product.fits}</p>
			<p class="cat">Not sure it fits your vehicle? Call or WhatsApp us with your registration number.</p>
			<div class="row" style="display: flex; gap: 8px; margin-top: 14px">
				<button class="btn" data-a="${product.id}" ${product.stock ? "" : "disabled"}>Add to basket</button>
				<button class="btn ghost" onclick="dlg.close()">Close</button>
			</div>`;
		$("#dlg").showModal();
	}

	if (target.dataset.q) {
		const [index, direction] = target.dataset.q.split(",");
		cart[index] = Math.max(1, Math.min(P[index].stock, (cart[index] || 1) + +direction));
		upd();
		openD("cart");
	}

	if (target.dataset.r) {
		delete cart[target.dataset.r];
		upd();
		openD("cart");
	}
});

$("#cartBtn").onclick = () => openD("cart");
$("#dx").onclick = () => $("#drawer").classList.remove("open");

function openD(view) {
	$("#drawer").classList.add("open");
	const body = $("#dbody");

	if (view == "cart") {
		$("#dt").textContent = "Your basket";
		const ids = Object.keys(cart);

		body.innerHTML = ids.length
			? ids
					.map(
						(index) => `<div class="line">
							<b>${P[index].name}</b>
							<span>${fmt(P[index].price * cart[index])}</span>
							<div class="qty">
								<button data-q="${index},-1" aria-label="Decrease">−</button>
								${cart[index]}
								<button data-q="${index},1" aria-label="Increase">+</button>
							</div>
							<button class="link" data-r="${index}">Remove</button>
						</div>`,
					)
					.join("") +
				`<div class="total">
					<span>Order total</span>
					<span>${fmt(total())}</span>
				</div>
				<button class="btn" style="width: 100%" id="go">Checkout</button>`
			: `<div class="empty">
					<p>Your basket is empty.</p>
					<p><a href="parts.html">Browse auto parts</a></p>
				</div>`;

		if ($("#go")) $("#go").onclick = () => openD("form");
	}

	if (view == "form") {
		$("#dt").textContent = "Delivery details";
		body.innerHTML = `<form id="f" novalidate>
			${[
				["name", "Full name", "text"],
				["phone", "Phone (e.g. 0772123456)", "tel"],
				["email", "Email (optional)", "email"],
				["addr", "Delivery address", "text"],
			]
				.map(
					(field) => `<label for="${field[0]}">${field[1]}</label>
						<input id="${field[0]}" type="${field[2]}">
						<div class="err" id="e_${field[0]}"></div>`,
				)
				.join("")}
			<label for="area">Delivery area</label>
			<select id="area">
				<option value="">Choose area</option>
				<option>Kampala Central</option>
				<option>Wakiso</option>
				<option>Mukono</option>
				<option>Entebbe</option>
				<option>Other (we will call you)</option>
			</select>
			<div class="err" id="e_area"></div>
			<label for="note">Vehicle details or notes (optional)</label>
			<textarea id="note" rows="2"></textarea>
			<div class="total">
				<span>Total</span>
				<span>${fmt(total())}</span>
			</div>
			<button class="btn" style="width: 100%">Submit order</button>
			<p><button type="button" class="link" id="bk">Back to basket</button></p>
		</form>`;

		$("#bk").onclick = () => openD("cart");
		$("#f").onsubmit = (event) => {
			event.preventDefault();
			const value = (key) => $("#" + key).value.trim();
			const errors = {};

			if (value("name").length < 3 || !/\s|^\S{3,}$/.test(value("name"))) {
				errors.name = "Enter your full name (at least 3 letters).";
			}

			if (!/^(\+256|0)7\d{8}$/.test(value("phone").replace(/\s/g, ""))) {
				errors.phone = "Enter a valid Ugandan number, like 0772123456.";
			}

			if (value("email") && !/^\S+@\S+\.\S+$/.test(value("email"))) {
				errors.email = "Enter a valid email, like name@example.com.";
			}

			if (value("addr").length < 5) {
				errors.addr = "Enter your street, village or landmark.";
			}

			if (!value("area")) {
				errors.area = "Choose a delivery area.";
			}

			["name", "phone", "email", "addr", "area"].forEach((key) => {
				$("#e_" + key).textContent = errors[key] || "";
				$("#" + key).classList.toggle("bad", !!errors[key]);
			});

			if (Object.keys(errors).length) return;

			const order = {
				no: "KAP-" + Math.floor(10000 + Math.random() * 89999),
				name: value("name"),
				area: value("area"),
				total: total(),
				items: Object.entries(cart).map(([index, quantity]) => quantity + " × " + P[index].name),
			};

			cart = {};
			upd();
			confirm(order);
		};
	}
}

function confirm(order) {
	$("#dt").textContent = "Order confirmed";
	const statuses = [
		"Order received",
		"Confirmed by our team",
		"Packed",
		"Out for delivery",
		"Delivered",
	];
	let step = 1;

	$("#dbody").innerHTML = `<h2>Thank you, ${order.name.split(" ")[0]}!</h2>
		<p>Your order number is <b>${order.no}</b>. We will call you to confirm delivery to ${order.area}.</p>
		<ul>${order.items.map((item) => `<li>${item}</li>`).join("")}</ul>
		<div class="total">
			<span>Total</span>
			<span>${fmt(order.total)}</span>
		</div>
		<h3>Order status (simulated)</h3>
		<ul class="steps" id="st">${statuses.map((status) => `<li>${status}</li>`).join("")}</ul>
		<button class="btn dark" onclick="drawer.classList.remove('open')">Close</button>`;

	const items = [...document.querySelectorAll("#st li")];
	const timer = setInterval(() => {
		items.slice(0, step).forEach((item) => item.classList.add("done"));

		if (++step > items.length) clearInterval(timer);
	}, 1800);

	items[0].classList.add("done");
}

upd();

const grid = $("#grid");

if (grid) {
	const categories = [...new Set(P.map((product) => product.cat))];

	$("#cat").innerHTML =
		'<option value="">All categories</option>' +
		categories.map((category) => `<option>${category}</option>`).join("");

	const draw = () => {
		const query = $("#q").value.toLowerCase();
		const category = $("#cat").value;
		const results = P.filter(
			(product) =>
				(!category || product.cat == category) &&
				(product.name + product.fits + product.cat).toLowerCase().includes(query),
		);

		$("#res").textContent =
			results.length + " product" + (results.length == 1 ? "" : "s") + " found";
		grid.innerHTML = results.length
			? results.map(card).join("")
			: '<div class="empty">No parts match your search. Try a different word or call us.</div>';
	};

	$("#q").oninput = draw;
	$("#cat").onchange = draw;
	draw();
}

const featured = $("#featured");

if (featured) {
	featured.innerHTML = [0, 2, 6, 4].map((index) => card(P[index])).join("");
}
