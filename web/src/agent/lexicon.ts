import type { AccessAttr, Category, Lang } from '../types';

/**
 * Multilingual keyword lexicon used by the offline understanding step.
 * It covers the five launch languages. A connected LLM replaces this with open-ended understanding,
 * but the offline path keeps Maple useful with no network and no API key.
 */

export type Keywords = string[];

export const CATEGORY_WORDS: Record<Category, Keywords> = {
  community: ['community', 'neighbour', 'neighbor', 'social', 'meet people', 'make friends', 'friends', 'conversation', '社区', '社區', '邻居', '鄰居', '交朋友', 'சமூகம்', 'அயலவர்', 'انجمن', 'همسایه', 'دوست'],
  arts: ['art', 'craft', 'poetry', 'poem', 'clay', 'paint', 'studio', 'creative', '艺术', '藝術', '手工', '诗', '詩', '绘画', 'கலை', 'கவிதை', 'هنر', 'شعر', 'نقاشی'],
  outdoors: ['outdoor', 'walk', 'walking', 'park', 'nature', 'hike', 'garden', '户外', '戶外', '散步', '公园', '公園', 'வெளிப்புற', 'நடை', 'پارک', 'پیاده‌روی', 'طبیعت'],
  learning: ['learn', 'class', 'workshop', 'maker', 'course', 'skill', 'job', 'computer', 'phone', '学习', '學習', '课', '課', '工作坊', 'கற்ற', 'வகுப்பு', 'یادگیری', 'کلاس', 'کارگاه'],
  family: ['family', 'kids', 'kid', 'children', 'child', 'toddler', 'baby', 'daughter', 'son ', '家庭', '孩子', '小朋友', '儿童', '兒童', 'குடும்ப', 'குழந்தை', 'خانواده', 'کودک', 'بچه'],
  volunteering: ['volunteer', 'help out', 'give back', 'pantry', '义工', '義工', '志愿', '志願', 'தன்னார்வ', 'داوطلب'],
  sports: ['sport', 'exercise', 'yoga', 'tai chi', 'fitness', 'badminton', 'movement', 'stretch', '运动', '運動', '太极', '太極', '瑜伽', 'உடற்பயிற்சி', 'யோகா', 'ورزش', 'یوگا', 'تای چی'],
  food: ['food', 'cook', 'cooking', 'dinner', 'recipe', 'eat', '美食', '做饭', '煮', '食谱', '食譜', 'உணவு', 'சமையல்', 'غذا', 'آشپزی'],
  music: ['music', 'concert', 'song', 'sing', 'choir', '音乐', '音樂', '唱歌', '合唱', 'இசை', 'பாடல்', 'موسیقی', 'آواز', 'کنسرت'],
};

export const FREE_WORDS: Keywords = ['free', 'no cost', 'cheap', 'budget', '免费', '免費', '不收费', 'இலவசம்', 'رایگان', 'مجانی'];
export const WEEKEND_WORDS: Keywords = ['weekend', 'saturday', 'sunday', '周末', '週末', '星期六', '星期日', '周六', '周日', '禮拜六', '礼拜六', 'வார இறுதி', 'சனி', 'ஞாயிறு', 'آخر هفته', 'شنبه', 'یکشنبه'];
export const WEEKDAY_WORDS: Keywords = ['weekday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', '平日', '工作日', '星期一', '星期二', '星期三', '星期四', '星期五', 'வார நாட்கள்', 'روزهای هفته'];
export const EVENING_WORDS: Keywords = ['evening', 'tonight', 'after work', 'night', '晚上', '夜晚', '下班后', 'மாலை', 'இரவு', 'عصر', 'شب'];
export const MORNING_WORDS: Keywords = ['morning', 'early', '早上', '上午', '早晨', 'காலை', 'صبح'];

export const TRANSIT_WORDS: Keywords = ['bus', 'transit', 'train', 'subway', 'no car', 'without a car', "don't drive", 'do not drive', 'dont drive', "can't drive", 'no licence', 'no license', '巴士', '公交', '公共交通', '地铁', '地鐵', '不开车', '不開車', '唔揸車', '冇車', 'பேருந்து', 'ரயில்', 'கார் இல்லை', 'اتوبوس', 'مترو', 'بدون ماشین', 'ماشین ندارم'];
export const CAR_WORDS: Keywords = ['i drive', 'by car', 'my car', 'driving', '开车', '開車', '揸車', 'கார்', 'ماشین دارم', 'رانندگی'];
export const WALK_WORDS: Keywords = ['walk there', 'on foot', 'walkable', 'nearby', 'close to home', '步行', '行路', '附近', 'நடந்து', 'அருகில்', 'پیاده', 'نزدیک'];

export const GROUP_WORDS: Record<'family' | 'seniors' | 'friends' | 'solo', Keywords> = {
  family: ['my kids', 'my child', 'my children', 'my daughter', 'my son', 'with family', 'toddler', 'family', '我的孩子', '我孩子', '带孩子', '帶孩子', '家人', 'என் குழந்தை', 'குடும்பத்துடன்', 'بچه‌هایم', 'فرزندم', 'خانواده'],
  seniors: ['senior', 'elderly', 'my mother', 'my father', 'my mom', 'my dad', 'grandma', 'grandpa', 'grandmother', 'grandfather', 'retired', 'older', '老人', '长辈', '長輩', '长者', '長者', '妈妈', '媽媽', '爸爸', '退休', 'மூத்த', 'அம்மா', 'அப்பா', 'سالمند', 'مادرم', 'پدرم', 'بازنشسته'],
  friends: ['with friends', 'my friends', '和朋友', '跟朋友', 'நண்பர்களுடன்', 'با دوستان'],
  solo: ['on my own', 'by myself', 'alone', 'solo', '一个人', '一個人', '自己一个', 'தனியாக', 'تنها'],
};

export const ACCESS_WORDS: Record<AccessAttr, Keywords> = {
  stepFree: ['wheelchair', 'step-free', 'step free', 'no stairs', 'stairs', 'ramp', 'walker', 'cane', 'mobility', '轮椅', '輪椅', '无台阶', '無台階', '冇梯級', '拐杖', '助行', 'சக்கர நாற்காலி', 'படிகள் இல்லை', 'ویلچر', 'بدون پله', 'عصا', 'واکر'],
  accessibleWashroom: ['accessible washroom', 'accessible bathroom', 'accessible toilet', '无障碍洗手间', '無障礙洗手間'],
  accessibleParking: ['accessible parking', 'disabled parking', '无障碍停车', '無障礙泊車'],
  seating: ['seat', 'sit down', 'sitting', 'chairs', 'tired easily', 'rest', 'benches', 'bad knee', 'bad back', '座位', '坐着', '坐著', '膝盖', '膝蓋', '腰', 'இருக்கை', 'உட்கார', 'صندلی', 'نشستن', 'زانو', 'کمر'],
  largePrint: ['large print', 'big print', 'low vision', 'blind', 'visually impaired', 'poor eyesight', '大字', '视力', '視力', '盲', 'பெரிய எழுத்து', 'பார்வை', 'چاپ درشت', 'نابینا', 'کم‌بینا'],
  audioDescription: ['audio description', '语音描述', '語音描述', 'ஒலி விளக்கம்', 'توضیح صوتی'],
  interpreter: ['interpreter', 'sign language', 'asl', 'lsq', '手语', '手語', '传译', '傳譯', 'சைகை', 'مترجم', 'زبان اشاره'],
  captions: ['caption', 'subtitle', 'deaf', 'hard of hearing', 'hearing loss', 'hearing aid', '字幕', '聋', '聾', '听力', '聽力', 'செவிட', 'கேட்கும்', 'زیرنویس', 'ناشنوا', 'کم‌شنوا'],
  lowNoise: ['quiet', 'calm', 'noise', 'loud', 'noisy', 'peaceful', 'sensory', 'overwhelm', 'autis', '安静', '安靜', '吵', '噪音', '自闭', '自閉', 'அமைதி', 'சத்தம்', 'آرام', 'ساکت', 'سر و صدا', 'اوتیسم'],
  noFlashing: ['flashing', 'strobe', 'seizure', 'epilep', 'migraine', 'photosensitive', '闪光', '閃光', '闪烁', '癫痫', '癲癇', '偏头痛', '偏頭痛', 'மின்னும்', 'வலிப்பு', 'چشمک', 'صرع', 'میگرن'],
  quietSpace: ['quiet room', 'quiet space', 'calm room', 'place to step out', '安静空间', '安靜空間', 'அமைதியான இடம்', 'فضای ساکت'],
  lowCrowd: ['crowd', 'crowded', 'small group', 'small gathering', 'anxiety', 'anxious', '人多', '拥挤', '擁擠', '焦虑', '焦慮', 'கூட்டம்', 'கவலை', 'شلوغ', 'اضطراب'],
  plainLanguage: ['plain language', 'simple language', 'dementia', 'memory loss', 'learning disability', 'cognitive', '浅白', '淺白', '失智', '记忆', '記憶', 'எளிய மொழி', 'நினைவு', 'زبان ساده', 'دمانس', 'حافظه'],
  supportPerson: ['support person', 'caregiver', 'carer', 'care worker', 'personal support', '陪同', '照顾者', '照顧者', 'துணையாளர்', 'پرستار', 'همراه'],
};

/** Statements that describe a lasting need, as opposed to a one-off request. */
export const FIRST_PERSON: Keywords = [
  'i am', "i'm", 'i use', 'i have', 'i need', 'i prefer', 'i like', 'i love', 'i enjoy', 'i live', 'i get', 'i do not', "i don't", "i can't", 'my ', 'we ', 'me ', '我', '我們', '我们', 'என்', 'நான்', 'من ', 'ما ',
];

export const AREA_WORDS: Record<string, Keywords> = {
  L3P: ['markham village', 'markham-village', 'l3p'],
  L3R: ['woodbine', 'denison', 'l3r'],
  L3S: ['milliken', 'armadale', 'l3s'],
  L3T: ['thornhill', 'l3t', '桑希尔', '桑希爾', 'தோர்ன்ஹில்', 'تورنهیل'],
  L6B: ['cornell', 'l6b', '康奈尔', '康奈爾'],
  L6C: ['berczy', 'angus glen', 'l6c'],
  L6E: ['greensborough', 'l6e'],
  L6G: ['unionville', 'l6g', '安省联合村', '聯合村', '尤宁维尔', 'யூனியன்வில்', 'یونیون ویل'],
};

export const LANGUAGE_WORDS: Record<Lang, Keywords> = {
  en: ['in english', 'english speaking'],
  yue: ['cantonese', '广东话', '廣東話', '粤语', '粵語', 'காண்டோனீஸ்', 'کانتونی'],
  zh: ['mandarin', '普通话', '普通話', '国语', '國語', 'மாண்டரின்', 'ماندارین'],
  ta: ['tamil', '泰米尔', '泰米爾', 'தமிழ்', 'تامیل'],
  fa: ['farsi', 'persian', '波斯语', '波斯語', 'பாரசீக', 'فارسی'],
};

export const HELP_WORDS: Keywords = ['help', 'what can you do', '帮助', '幫助', '你能做什么', 'உதவி', 'کمک'];
export const GREETING_WORDS: Keywords = ['hello', 'hi ', 'hey', 'good morning', '你好', '哈囉', '哈喽', '您好', 'வணக்கம்', 'سلام'];

export function hasAny(text: string, words: Keywords): boolean {
  return words.some((w) => text.includes(w));
}
