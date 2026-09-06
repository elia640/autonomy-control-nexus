# Control Center Hub

זה מסך ניטור תקשורת באפליקציה שמנהגת ומנהלת כלי רכב אוטונומיים ושמנוהגים מרחוק. דרך מסך זה, המפעיל יודע לנטר היכן כל כלי נמצא על גבי המפה, איזה סוג תקשורת הוא עובד ומה איכות התקשורת. בנוסף, המפעיל יכול לבצע מספר פקודות ופעולות דרך המסך הזה אבקש להתייחס כרגע רק לעמודה הימנית שבראש הכותרת כתוב "PRECHECK" - אבקש שבכותרת העמודה, מעל ה-PRECHECK יהיה כתוב CONTROL ROOM. כותרת ברורה ובולטת אך שתשתלב עם העיצוב. בגרף, להוריד את הקו הכתום של - LATENCY. בתחתית העמודה, מצד ימין להוסיף 2 פקדים - אחד "טקטי" והשני "לוגי" ואת פקד הטקטי לצבוע בכחול. ליד הפקדים האלה, להויסף פקד של "הגדרות". בנוסף, מעל כל שלושת ה-SIMS להציג את שם המודם, ולצידו פגד TUGGEL עם אפשרות כיבוי והדלקה וסטאטוס תקינות של המודם וחום של המודם וצריכת CPU. לצד כל SIM לשים פקד TUGGEL עם אפשרות כיבוי והדלקה. בנוסף, למעל ה-SATCOM יש להציג את המודם, שלצידו יש להציב פקד TUGGEL עם אפשרות לכיבי הודלקה, אם הלויין נעול או לא נעול. יש להציב גם שורה חדשה של תקשורת רדיו, עם איכות התקשורת כמו שאר החיווים, אפשרות לכיבוי והדלקה בדומה למודם, וקצב ההורדה. לגבי הגרף , יש להציג בשנתות באופקי שניות ובאנכי קצב MBPS. יש להוסיך אפשרות של סימון תחת הגרף בצ'ק בוקס אם אני רוצה להציג רק קצב או רק רוחב פס

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/eac7571f-376b-4ce6-932f-68fb42c5be22).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
