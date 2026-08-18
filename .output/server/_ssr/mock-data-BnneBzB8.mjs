//#region node_modules/.nitro/vite/services/ssr/assets/mock-data-BnneBzB8.js
var equityCurve = Array.from({ length: 30 }, (_, i) => {
	const base = 1e4;
	const drift = i * 120;
	const noise = Math.sin(i * .6) * 400 + Math.cos(i * .3) * 200;
	return {
		day: `روز ${i + 1}`,
		equity: Math.round(base + drift + noise),
		balance: Math.round(base + drift + noise * .6)
	};
});
var monthlyPerformance = [
	{
		month: "فروردین",
		pnl: 820
	},
	{
		month: "اردیبهشت",
		pnl: -320
	},
	{
		month: "خرداد",
		pnl: 1240
	},
	{
		month: "تیر",
		pnl: 640
	},
	{
		month: "مرداد",
		pnl: -180
	},
	{
		month: "شهریور",
		pnl: 1580
	},
	{
		month: "مهر",
		pnl: 940
	},
	{
		month: "آبان",
		pnl: 2100
	}
];
var winLossData = [{
	name: "برنده",
	value: 68,
	color: "oklch(0.75 0.17 155)"
}, {
	name: "بازنده",
	value: 32,
	color: "oklch(0.65 0.23 25)"
}];
var drawdownData = Array.from({ length: 20 }, (_, i) => ({
	day: `${i + 1}`,
	dd: -(Math.abs(Math.sin(i * .4)) * 8 + Math.random() * 2)
}));
var trades = [
	{
		id: "T-1042",
		symbol: "EURUSD",
		side: "buy",
		entry: 1.0842,
		exit: 1.0891,
		volume: 1.2,
		pnl: 588,
		rr: 2.4,
		date: "۱۴۰۳/۰۸/۱۲",
		portfolio: "پرتفوی اصلی",
		followedPlan: true,
		emotion: "آرام"
	},
	{
		id: "T-1041",
		symbol: "XAUUSD",
		side: "sell",
		entry: 2412.5,
		exit: 2398.2,
		volume: .5,
		pnl: 715,
		rr: 1.8,
		date: "۱۴۰۳/۰۸/۱۱",
		portfolio: "پرتفوی اصلی",
		followedPlan: true,
		emotion: "متمرکز"
	},
	{
		id: "T-1040",
		symbol: "BTCUSDT",
		side: "buy",
		entry: 68420,
		exit: 67980,
		volume: .05,
		pnl: -220,
		rr: -.9,
		date: "۱۴۰۳/۰۸/۱۰",
		portfolio: "کریپتو",
		followedPlan: false,
		emotion: "طمع (FOMO)"
	},
	{
		id: "T-1039",
		symbol: "GBPJPY",
		side: "sell",
		entry: 198.42,
		exit: 197.6,
		volume: .8,
		pnl: 512,
		rr: 2.1,
		date: "۱۴۰۳/۰۸/۰۹",
		portfolio: "پرتفوی اصلی",
		followedPlan: true,
		emotion: "آرام"
	},
	{
		id: "T-1038",
		symbol: "US30",
		side: "buy",
		entry: 42150,
		exit: 41980,
		volume: .3,
		pnl: -340,
		rr: -1.2,
		date: "۱۴۰۳/۰۸/۰۸",
		portfolio: "شاخص‌ها",
		followedPlan: false,
		emotion: "انتقام"
	},
	{
		id: "T-1037",
		symbol: "EURUSD",
		side: "buy",
		entry: 1.0801,
		exit: 1.0844,
		volume: 1,
		pnl: 430,
		rr: 1.9,
		date: "۱۴۰۳/۰۸/۰۷",
		portfolio: "پرتفوی اصلی",
		followedPlan: true,
		emotion: "متمرکز"
	},
	{
		id: "T-1036",
		symbol: "ETHUSDT",
		side: "sell",
		entry: 3420,
		exit: 3388,
		volume: .4,
		pnl: 128,
		rr: 1.1,
		date: "۱۴۰۳/۰۸/۰۶",
		portfolio: "کریپتو",
		followedPlan: true,
		emotion: "آرام"
	},
	{
		id: "T-1035",
		symbol: "XAUUSD",
		side: "buy",
		entry: 2380.2,
		exit: 2364.1,
		volume: .7,
		pnl: -1127,
		rr: -1.6,
		date: "۱۴۰۳/۰۸/۰۵",
		portfolio: "پرتفوی اصلی",
		followedPlan: false,
		emotion: "ترس"
	}
];
var portfolios = [
	{
		id: "P1",
		name: "پرتفوی اصلی",
		broker: "IC Markets",
		type: "استاندارد",
		balance: 12480,
		initial: 1e4,
		leverage: "1:100",
		currency: "USD",
		trades: 87,
		status: "فعال"
	},
	{
		id: "P2",
		name: "کریپتو",
		broker: "Binance",
		type: "Spot",
		balance: 4820,
		initial: 5e3,
		leverage: "1:1",
		currency: "USDT",
		trades: 34,
		status: "فعال"
	},
	{
		id: "P3",
		name: "شاخص‌ها",
		broker: "Pepperstone",
		type: "پرو",
		balance: 8200,
		initial: 8e3,
		leverage: "1:200",
		currency: "USD",
		trades: 22,
		status: "فعال"
	},
	{
		id: "P4",
		name: "حساب چالش FTMO",
		broker: "FTMO",
		type: "چالش",
		balance: 1e5,
		initial: 1e5,
		leverage: "1:100",
		currency: "USD",
		trades: 12,
		status: "آرشیو"
	}
];
var journalEntries = [
	{
		id: "J1",
		date: "۱۴۰۳/۰۸/۱۲",
		tradeId: "T-1042",
		title: "ست‌آپ EURUSD در حمایت روزانه",
		mistakes: "بدون خطای مهم",
		lesson: "پایبندی به SL کلید بود.",
		emotion: "آرام",
		plan: true
	},
	{
		id: "J2",
		date: "۱۴۰۳/۰۸/۱۰",
		tradeId: "T-1040",
		title: "ورود احساسی به BTCUSDT",
		mistakes: "ورود بدون تأیید، دنبال کردن قیمت",
		lesson: "منتظر پولبک بمانم؛ FOMO قاتل اکانت است.",
		emotion: "طمع",
		plan: false
	},
	{
		id: "J3",
		date: "۱۴۰۳/۰۸/۰۸",
		tradeId: "T-1038",
		title: "معامله انتقامی روی US30",
		mistakes: "بلافاصله بعد از ضرر معامله مجدد.",
		lesson: "بعد از ضرر ۳۰ دقیقه استراحت الزامی است.",
		emotion: "انتقام",
		plan: false
	}
];
var goals = [
	{
		id: "G1",
		title: "رسیدن به ۱۵٪ سود ماهانه",
		progress: 62
	},
	{
		id: "G2",
		title: "حداکثر ۱٪ ریسک در هر معامله",
		progress: 88
	},
	{
		id: "G3",
		title: "نوشتن ژورنال برای ۱۰۰٪ معاملات",
		progress: 74
	},
	{
		id: "G4",
		title: "کاهش Overtrading به زیر ۵ معامله در روز",
		progress: 45
	}
];
var achievements = [
	{
		id: "A1",
		title: "۷ روز پایبند به پلن",
		desc: "یک هفته کامل طبق قوانین ترید کردی.",
		earned: true
	},
	{
		id: "A2",
		title: "کاهش دراودان ۵٪",
		desc: "حداکثر دراودان را نصف کردی.",
		earned: true
	},
	{
		id: "A3",
		title: "بدون Revenge Trade در یک ماه",
		desc: "کنترل احساسات درجه یک.",
		earned: false
	},
	{
		id: "A4",
		title: "۱۰۰ معامله ثبت‌شده",
		desc: "قهرمان ژورنال‌نویسی.",
		earned: true
	},
	{
		id: "A5",
		title: "Profit Factor بالای ۲",
		desc: "استراتژی سودده اثبات‌شده.",
		earned: false
	},
	{
		id: "A6",
		title: "بدون ورود احساسی در ۳۰ روز",
		desc: "روانشناسی طلایی.",
		earned: false
	},
	{
		id: "A7",
		title: "اولین معامله ثبت‌شده",
		desc: "سفرت را شروع کردی.",
		earned: true
	},
	{
		id: "A8",
		title: "۳۰ روز متوالی ژورنال‌نویسی",
		desc: "عادت طلایی ساخته شد.",
		earned: true
	},
	{
		id: "A9",
		title: "ماه سودده",
		desc: "یک ماه کامل با سود مثبت.",
		earned: true
	},
	{
		id: "A10",
		title: "Win Rate بالای ۷۰٪",
		desc: "دقت شکار درجه یک.",
		earned: false
	},
	{
		id: "A11",
		title: "ریسک زیر ۱٪ در ۵۰ معامله",
		desc: "مدیر ریسک واقعی.",
		earned: true
	},
	{
		id: "A12",
		title: "بدون Overtrading در ۲ هفته",
		desc: "صبر یعنی همین.",
		earned: false
	},
	{
		id: "A13",
		title: "دابل کردن سرمایه",
		desc: "سرمایه اولیه‌ات را دو برابر کردی.",
		earned: false
	},
	{
		id: "A14",
		title: "۱۰ معامله A+ متوالی",
		desc: "فقط ست‌آپ‌های تمیز.",
		earned: false
	},
	{
		id: "A15",
		title: "اتصال موفق متاتریدر",
		desc: "همگام‌سازی خودکار فعال شد.",
		earned: true
	},
	{
		id: "A16",
		title: "استاد چک‌لیست",
		desc: "۵۰ چک‌لیست کامل قبل از ورود.",
		earned: false
	}
];
var calendarDays = Array.from({ length: 35 }, (_, i) => {
	const day = i - 3;
	if (day < 1 || day > 30) return {
		day: null,
		pnl: 0,
		trades: 0
	};
	const seed = Math.sin(i * 1.7) * 800 + Math.cos(i * .9) * 400;
	const pnl = Math.round(seed);
	return {
		day,
		pnl,
		trades: Math.abs(pnl) > 100 ? Math.floor(Math.random() * 4) + 1 : 0
	};
});
var users = [
	{
		id: "U1",
		name: "علی رضایی",
		email: "ali@example.com",
		plan: "Pro Max",
		status: "فعال",
		joined: "۱۴۰۳/۰۵/۱۲"
	},
	{
		id: "U2",
		name: "مریم احمدی",
		email: "maryam@example.com",
		plan: "Pro",
		status: "فعال",
		joined: "۱۴۰۳/۰۶/۰۲"
	},
	{
		id: "U3",
		name: "حسین کریمی",
		email: "hk@example.com",
		plan: "رایگان",
		status: "فعال",
		joined: "۱۴۰۳/۰۷/۱۹"
	},
	{
		id: "U4",
		name: "نگار موسوی",
		email: "negar@example.com",
		plan: "Pro",
		status: "معلق",
		joined: "۱۴۰۳/۰۴/۰۸"
	},
	{
		id: "U5",
		name: "امیر صادقی",
		email: "amir@example.com",
		plan: "Pro Max",
		status: "فعال",
		joined: "۱۴۰۳/۰۳/۱۵"
	}
];
var payments = [
	{
		id: "PY1",
		user: "علی رضایی",
		plan: "Pro Max",
		amount: "۲,۰۰۰,۰۰۰ تومان",
		date: "۱۴۰۳/۰۸/۰۱",
		status: "موفق"
	},
	{
		id: "PY2",
		user: "مریم احمدی",
		plan: "Pro",
		amount: "۱,۰۰۰,۰۰۰ تومان",
		date: "۱۴۰۳/۰۷/۲۸",
		status: "موفق"
	},
	{
		id: "PY3",
		user: "امیر صادقی",
		plan: "Pro Max",
		amount: "۲,۰۰۰,۰۰۰ تومان",
		date: "۱۴۰۳/۰۷/۲۰",
		status: "موفق"
	},
	{
		id: "PY4",
		user: "نگار موسوی",
		plan: "Pro",
		amount: "۱,۰۰۰,۰۰۰ تومان",
		date: "۱۴۰۳/۰۷/۱۵",
		status: "ناموفق"
	}
];
var aiInsights = {
	scores: [
		{
			label: "نظم معاملاتی",
			value: 78
		},
		{
			label: "مدیریت سرمایه",
			value: 84
		},
		{
			label: "روانشناسی",
			value: 62
		},
		{
			label: "پایبندی به پلن",
			value: 71
		}
	],
	strengths: [
		{
			title: "پایبندی بالا به حد ضرر در ۹۲٪ معاملات",
			keepDoing: "قبل از هر معامله، SL را همان لحظه ورود در پلتفرم ثبت کن. حتی یک بار جابجایی SL این عادت را می‌شکند."
		},
		{
			title: "میانگین R:R مثبت ۱.۸",
			keepDoing: "همچنان روی ست‌آپ‌هایی تمرکز کن که حداقل R:R = ۲ دارند و از ورود به معاملات با ریسک به ریوارد کم پرهیز کن."
		},
		{
			title: "عملکرد پایدار روی جفت‌ارز EURUSD",
			keepDoing: "یک ژورنال جداگانه فقط برای EURUSD نگه دار و ساعت‌های طلایی معاملاتت روی این جفت‌ارز را شناسایی و تکرار کن."
		}
	],
	weaknesses: [
		{
			title: "الگوی Revenge Trading بعد از ۳ ضرر متوالی",
			solution: "بعد از ۲ ضرر متوالی، پلتفرم را قفل کن و ۳۰ دقیقه پیاده‌روی کن. قانون «حداکثر ۳ ضرر در روز = پایان روز» را در تنظیمات ریسک فعال کن."
		},
		{
			title: "افزایش حجم معامله در روزهای پرنوسان",
			solution: "قانون ثابت ۱٪ ریسک را از فرم ثبت معامله جدا نکن. در روزهای اخبار مهم (NFP, FOMC) حجم را نصف کن."
		},
		{
			title: "کاهش کیفیت ژورنال در آخر هفته",
			solution: "پنج‌شنبه‌ها یک بازه ۱۵ دقیقه‌ای در تقویم رزرو کن فقط برای مرور معاملات هفته. یادآور خودکار در بخش اعلانات فعال است."
		}
	],
	suggestions: [
		"بعد از هر ضرر، ۳۰ دقیقه از پلتفرم فاصله بگیرید.",
		"چک‌لیست ورود را قبل از هر معامله تکمیل کنید.",
		"حداکثر ۳ معامله در روز کافیست — کیفیت بر کمیت."
	],
	behaviors: [
		{
			name: "FOMO",
			count: 4
		},
		{
			name: "Revenge Trading",
			count: 3
		},
		{
			name: "Overtrading",
			count: 6
		},
		{
			name: "ترس از ضرر",
			count: 2
		}
	],
	models: [
		{
			id: "coach-pro",
			name: "Coach Pro (پیش‌فرض)",
			desc: "متعادل — تحلیل عمیق با لحن حمایتی"
		},
		{
			id: "coach-strict",
			name: "Coach Strict",
			desc: "سختگیر — روی اشتباهات و انضباط تمرکز می‌کند"
		},
		{
			id: "coach-mentor",
			name: "Coach Mentor",
			desc: "آموزش‌محور — با مثال و مرحله‌به‌مرحله"
		},
		{
			id: "coach-quant",
			name: "Coach Quant",
			desc: "داده‌محور — گزارش آماری و متریک‌های حرفه‌ای"
		}
	],
	dailyReport: {
		date: "۱۴۰۳/۰۸/۱۲",
		summary: "امروز ۴ معامله ثبت کردی که ۳ تای آن‌ها با پلن مطابقت داشت. سود خالص روز +$۵۸۸ بود و بیشترین سود از EURUSD در بازه لندن آمد. یک بار بعد از ضرر US30 بلافاصله وارد BTCUSDT شدی که الگوی Revenge Trading است — این نقطه‌ای است که باید مراقبش باشی.",
		stats: [
			{
				label: "تعداد معامله",
				value: "۴"
			},
			{
				label: "سود خالص",
				value: "+$۵۸۸"
			},
			{
				label: "Win Rate",
				value: "۷۵٪"
			},
			{
				label: "پایبندی به پلن",
				value: "۷۵٪"
			}
		],
		highlights: [
			"بهترین معامله: EURUSD خرید در حمایت روزانه (+$۵۸۸)",
			"بدترین معامله: US30 خرید خلاف روند (-$۳۴۰)",
			"بازه طلایی: ۱۰:۰۰ تا ۱۳:۰۰ به وقت لندن"
		]
	},
	weeklyReport: {
		range: "۱۴۰۳/۰۸/۰۶ تا ۱۴۰۳/۰۸/۱۲",
		summary: "هفته سبز — سود خالص +$۱,۳۲۶ روی ۸ معامله. Win Rate ۶۲.۵٪ و Profit Factor ۲.۱. نقاط قوت این هفته: پایبندی ۹۲٪ به SL و صبر برای ست‌آپ‌های تمیز. نقطه ضعف: در ۳ روز که ضرر متوالی داشتی، معاملات اضافی زدی که هیچ‌کدام سودده نبودند. اگر آن ۳ معامله را حذف کنی، PF به ۲.۹ می‌رسد.",
		stats: [
			{
				label: "کل معاملات",
				value: "۸"
			},
			{
				label: "سود خالص",
				value: "+$۱,۳۲۶"
			},
			{
				label: "Win Rate",
				value: "۶۲.۵٪"
			},
			{
				label: "Profit Factor",
				value: "۲.۱"
			},
			{
				label: "بهترین نماد",
				value: "EURUSD"
			},
			{
				label: "بدترین نماد",
				value: "US30"
			}
		],
		highlights: [
			"بهترین روز: شنبه با +$۷۱۵ (XAUUSD)",
			"بدترین روز: دوشنبه با -$۱,۱۲۷ (XAUUSD)",
			"میانگین R:R: ۱.۸ (هدف: ۲.۰)",
			"پیشنهاد هفته آینده: تعداد معاملات را به ۶ محدود کن."
		]
	}
};
//#endregion
export { equityCurve as a, monthlyPerformance as c, trades as d, users as f, drawdownData as i, payments as l, aiInsights as n, goals as o, winLossData as p, calendarDays as r, journalEntries as s, achievements as t, portfolios as u };
