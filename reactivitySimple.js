class Dep {
  constructor() {
    this.subscribers = [];
  }

  depend() {
    if (target && !this.subscribers.includes(target)) {
      this.subscribers.push(target);
    }
  }

  notify() {
    this.subscribers.forEach(sub => sub());
  }
}

let target;

function watcher(myFunc) {
  target = myFunc;
  target();
  target = null;
}

const data = {
  quantity: 10,
  price: 100,
  wishList: ["Ball", "Socks"],
  items: {
    ball: {
      color: "red"
    }
  }
};

function defineReactivity(obj, key) {
  var dep = new Dep();
  var internalValue = obj[key];

  Object.defineProperty(obj, key, {
    get() {
      dep.depend();
      return internalValue;
    },
    set(newVal) {
      primitive = internalValue;
      dep.notify();
    }
  });

  return { notify: dep.notify.bind(dep) };
}

const observers = new Map();

function walk(obj) {
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === "object") {
      walk(obj[key]);
    }

    const { notify } = defineReactivity(obj, key);
    observers.set(obj[key], notify);
  });
}

function set(obj, key, value) {
  obj[key] = value;
  defineReactivity(obj, key);
  observers.get(obj).call();
}

walk(data);

let total = 0;
let halfPrice = 0;
let myWishlist = "";

watcher(() => (total = data.price * data.quantity));
watcher(() => (halfPrice = data.price * 0.5));
watcher(() => (myWishlist = data.wishList.join(", ")));
