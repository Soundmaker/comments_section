import "./css/normalize.css";
import "./css/style.scss";

let form = document.getElementById("form");
let commentList = document.querySelector(".comments__inner");

form.date.setAttribute("max", form.date.value);

form.addEventListener("input", (e) => {
  let elem = e.target;

  if (elem.classList.contains("error")) {
    let notify = document.querySelectorAll(`[data-target="${elem.name}"]`);

    Array.from(notify).forEach((el) => el.remove());

    elem.classList.remove("error");
  }
});

form.addEventListener("submit", handleSubmit);

form.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    form.submitbtn.click();
  }
});

function handleSubmit(e) {
  e.preventDefault();

  let { name, date, text } = form;

  if (name.value === "") {
    notify(name, "Введите имя!");
    return false;
  }

  if (name.value.length < 3) {
    notify(name, "Имя не должно быть меньше 3-x символов!");
    return false;
  }

  if (text.value.trim() === "") {
    notify(text, "Комментарий должен содержать символы!");
    text.value = "";
    return false;
  }

  if (date.value === "") date.value = new Date().toISOString().substring(0, 10);

  const randomColor = Math.floor(Math.random() * 16777215).toString(16);

  commentList.insertAdjacentHTML(
    "afterbegin",
    `
    <div class="comment">
      <div class="comment__logo" style="background-color: #${randomColor};">${
      name.value[0]
    }</div>
        <span class="comment__name">${name.value}</span>
        <span class="comment__date">${convertDate(date)}</span>
        <p class="comment__text">
          ${text.value}
        </p>
        <div class="comment__flex">
        <a class="comment__like" href="#">
        <img src="https://img.icons8.com/ios/30/000000/facebook-like--v1.png" alt="like"/>
          Лайк
        </a>
        <a class="comment__remove" href="#" title="Удалить комментарий">
        <img src="https://img.icons8.com/ios/25/000000/delete--v1.png" alt="delete"/>
        </a>
      </div>
    </div>
  `
  );

  form.submitBtn.blur();
  name.value = "";
  text.value = "";
  date.value = new Date().toISOString().slice(0, 10);
}

function notify(target, message) {
  let coords = target.getBoundingClientRect();
  let elem = document.createElement("div");

  target.classList.add("error");
  target.focus();

  elem.classList.add("notify");

  elem.style.cssText = `
    top: ${coords.bottom + window.scrollY}px;
    left: ${coords.left + coords.width / 2}px;
  `;

  elem.innerHTML = `${message}`;
  elem.setAttribute("data-target", `${target.name}`);

  document.body.append(elem);
}

function convertDate(elem) {
  let dateToday = new Date();
  let date = new Date(elem.value);

  let tzoffset = new Date().getTimezoneOffset() * 60000;
  let localISOString = (date) =>
    new Date(date - tzoffset).toISOString().slice(0, -1);

  date.setHours(
    dateToday.getHours(),
    dateToday.getMinutes(),
    dateToday.getSeconds(),
    dateToday.getMilliseconds()
  );

  if (dateToday.getDate() === date.getDate()) {
    return "Сегодня, " + localISOString(date).substring(11, 16);
  } else if (dateToday - date <= 24 * 60 * 60 * 1000) {
    return "Вчера, " + localISOString(date).substring(11, 16);
  }

  return localISOString(date).substring(0, 10).split("-").reverse().join(".");
}

document.addEventListener("click", (e) => {
  let elem = e.target;

  if (elem?.closest(".comment__like") || elem?.closest(".comment__remove"))
    e.preventDefault();

  elem?.closest(".comment__like")?.classList.toggle("active");
  elem?.closest(".comment__remove")?.closest(".comment").remove();
});
