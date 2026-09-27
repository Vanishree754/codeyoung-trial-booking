import Database from "better-sqlite3";
import path from "node:path";
import { fileURLToPath } from "url";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "../../data");
const dbPath = path.join(dataDir, "codeyoung.sqlite");

fs.mkdirSync(dataDir, { recursive: true });

export const db = new Database(dbPath);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
db.pragma("busy_timeout = 5000");

export function initializeDatabase() {
  // =========================================================
  // 1. CREATE BASE TABLES
  // =========================================================

  db.exec(`
    CREATE TABLE IF NOT EXISTS parents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      timezone TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS mentors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      timezone TEXT NOT NULL,
      max_classes_per_day INTEGER NOT NULL DEFAULT 2
        CHECK(max_classes_per_day > 0),
      active INTEGER NOT NULL DEFAULT 1
        CHECK(active IN (0, 1)),
      rating REAL NOT NULL DEFAULT 4.5
        CHECK(rating >= 0 AND rating <= 5),
      availability_start TEXT NOT NULL DEFAULT '09:00',
      availability_end TEXT NOT NULL DEFAULT '18:00',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      active INTEGER NOT NULL DEFAULT 1
        CHECK(active IN (0, 1)),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS mentor_courses (
      mentor_id INTEGER NOT NULL,
      course_id INTEGER NOT NULL,

      PRIMARY KEY (mentor_id, course_id),

      FOREIGN KEY (mentor_id)
        REFERENCES mentors(id)
        ON DELETE CASCADE,

      FOREIGN KEY (course_id)
        REFERENCES courses(id)
        ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      parent_id INTEGER NOT NULL,
      mentor_id INTEGER NOT NULL,
      course_id INTEGER,

      start_time_utc TEXT NOT NULL,
      end_time_utc TEXT NOT NULL,

      status TEXT NOT NULL DEFAULT 'CONFIRMED'
        CHECK(status IN ('CONFIRMED', 'CANCELLED')),

      meeting_link TEXT NOT NULL UNIQUE,

      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (parent_id)
        REFERENCES parents(id),

      FOREIGN KEY (mentor_id)
        REFERENCES mentors(id),

      FOREIGN KEY (course_id)
        REFERENCES courses(id)
    );

    CREATE INDEX IF NOT EXISTS idx_bookings_mentor_start
      ON bookings(mentor_id, start_time_utc);

    CREATE INDEX IF NOT EXISTS idx_bookings_parent_start
      ON bookings(parent_id, start_time_utc);

    CREATE INDEX IF NOT EXISTS idx_bookings_status_start_end
      ON bookings(status, start_time_utc, end_time_utc);

    CREATE INDEX IF NOT EXISTS idx_mentor_courses_course
      ON mentor_courses(course_id);

    CREATE INDEX IF NOT EXISTS idx_mentor_courses_mentor
      ON mentor_courses(mentor_id);
  `);

  // =========================================================
  // 2. SAFE MIGRATIONS FOR EXISTING DATABASES
  // =========================================================

  const mentorColumns = db
    .prepare("PRAGMA table_info(mentors)")
    .all();

  const mentorColumnNames = new Set(
    mentorColumns.map((column) => column.name)
  );

  if (!mentorColumnNames.has("rating")) {
    db.exec(`
      ALTER TABLE mentors
      ADD COLUMN rating REAL NOT NULL DEFAULT 4.5
      CHECK(rating >= 0 AND rating <= 5)
    `);
  }

  if (!mentorColumnNames.has("availability_start")) {
    db.exec(`
      ALTER TABLE mentors
      ADD COLUMN availability_start TEXT NOT NULL DEFAULT '09:00'
    `);
  }

  if (!mentorColumnNames.has("availability_end")) {
    db.exec(`
      ALTER TABLE mentors
      ADD COLUMN availability_end TEXT NOT NULL DEFAULT '18:00'
    `);
  }

  // =========================================================
  // 3. BOOKING COURSE MIGRATION
  // =========================================================

  const bookingColumns = db
    .prepare("PRAGMA table_info(bookings)")
    .all();

  const bookingColumnNames = new Set(
    bookingColumns.map((column) => column.name)
  );

  if (!bookingColumnNames.has("course_id")) {
    db.exec(`
      ALTER TABLE bookings
      ADD COLUMN course_id INTEGER
    `);
  }

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_bookings_course
      ON bookings(course_id)
  `);
}

export function seedDatabase() {
  // =========================================================
  // 1. MENTORS
  // =========================================================

  const mentorCount = db
    .prepare("SELECT COUNT(*) AS count FROM mentors")
    .get().count;

  if (mentorCount === 0) {
    const insertMentor = db.prepare(`
      INSERT INTO mentors (
        name,
        email,
        timezone,
        max_classes_per_day,
        active,
        rating,
        availability_start,
        availability_end
      )
      VALUES (?, ?, ?, 2, 1, ?, ?, ?)
    `);

    const mentors = [
      [
        "Ananya Sharma",
        "vanishreegm4+ananya@gmail.com",
        4.9,
        "09:00",
        "18:00"
      ],
      [
        "Rahul Kumar",
        "vanishreegm4+rahul@gmail.com",
        4.8,
        "10:00",
        "19:00"
      ],
      [
        "Priya Nair",
        "vanishreegm4+priya@gmail.com",
        4.9,
        "12:00",
        "21:00"
      ],
      [
        "Arjun Rao",
        "vanishreegm4+arjun@gmail.com",
        4.7,
        "09:00",
        "18:00"
      ],
      [
        "Meera Iyer",
        "vanishreegm4+meera@gmail.com",
        4.8,
        "11:00",
        "20:00"
      ],
      [
        "Vikram Singh",
        "vanishreegm4+vikram@gmail.com",
        4.6,
        "10:00",
        "19:00"
      ],
      [
        "Kavya Reddy",
        "vanishreegm4+kavya@gmail.com",
        4.9,
        "12:00",
        "21:00"
      ],
      [
        "Aditya Joshi",
        "vanishreegm4+aditya@gmail.com",
        4.7,
        "09:00",
        "18:00"
      ],
      [
        "Sneha Menon",
        "vanishreegm4+sneha@gmail.com",
        4.8,
        "11:00",
        "20:00"
      ],
      [
        "Rohan Patel",
        "vanishreegm4+rohan@gmail.com",
        4.6,
        "10:00",
        "19:00"
      ]
    ];

    const seedMentors = db.transaction(() => {
      for (const [
        name,
        email,
        rating,
        availabilityStart,
        availabilityEnd
      ] of mentors) {
        insertMentor.run(
          name,
          email,
          "Asia/Kolkata",
          rating,
          availabilityStart,
          availabilityEnd
        );
      }
    });

    seedMentors();
  }

  // =========================================================
  // 2. UPDATE EXISTING MENTOR DATA
  // =========================================================

  /*
   * Existing mentor records may still contain:
   *
   * - sideshgm@gmail.com
   * - @codeyoung.demo
   * - other previous email addresses
   *
   * Each mentor must have a UNIQUE email because mentors.email
   * has a UNIQUE constraint.
   *
   * We therefore update the records by mentor name and assign
   * a unique Gmail plus-address to every mentor.
   */

  const mentorSchedules = [
    [
      "Ananya Sharma",
      "vanishreegm4+ananya@gmail.com",
      4.9,
      "09:00",
      "18:00"
    ],
    [
      "Rahul Kumar",
      "vanishreegm4+rahul@gmail.com",
      4.8,
      "10:00",
      "19:00"
    ],
    [
      "Priya Nair",
      "vanishreegm4+priya@gmail.com",
      4.9,
      "12:00",
      "21:00"
    ],
    [
      "Arjun Rao",
      "vanishreegm4+arjun@gmail.com",
      4.7,
      "09:00",
      "18:00"
    ],
    [
      "Meera Iyer",
      "vanishreegm4+meera@gmail.com",
      4.8,
      "11:00",
      "20:00"
    ],
    [
      "Vikram Singh",
      "vanishreegm4+vikram@gmail.com",
      4.6,
      "10:00",
      "19:00"
    ],
    [
      "Kavya Reddy",
      "vanishreegm4+kavya@gmail.com",
      4.9,
      "12:00",
      "21:00"
    ],
    [
      "Aditya Joshi",
      "vanishreegm4+aditya@gmail.com",
      4.7,
      "09:00",
      "18:00"
    ],
    [
      "Sneha Menon",
      "vanishreegm4+sneha@gmail.com",
      4.8,
      "11:00",
      "20:00"
    ],
    [
      "Rohan Patel",
      "vanishreegm4+rohan@gmail.com",
      4.6,
      "10:00",
      "19:00"
    ]
  ];

  /*
   * IMPORTANT:
   *
   * We cannot simply update all mentors to the new addresses
   * one by one because the old database may currently contain
   * duplicate email values such as sideshgm@gmail.com.
   *
   * The temporary unique values below prevent SQLite's UNIQUE
   * constraint from causing a conflict while migration runs.
   */

  const temporaryEmails = [
    "migration+mentor1@codeyoung.local",
    "migration+mentor2@codeyoung.local",
    "migration+mentor3@codeyoung.local",
    "migration+mentor4@codeyoung.local",
    "migration+mentor5@codeyoung.local",
    "migration+mentor6@codeyoung.local",
    "migration+mentor7@codeyoung.local",
    "migration+mentor8@codeyoung.local",
    "migration+mentor9@codeyoung.local",
    "migration+mentor10@codeyoung.local"
  ];

  const setTemporaryEmail = db.prepare(`
    UPDATE mentors
    SET email = ?
    WHERE id = ?
  `);

  const getMentorId = db.prepare(`
    SELECT id
    FROM mentors
    WHERE name = ?
  `);

  const updateMentor = db.prepare(`
    UPDATE mentors
    SET
      email = ?,
      rating = ?,
      availability_start = ?,
      availability_end = ?
    WHERE id = ?
  `);

  const updateMentors = db.transaction(() => {
    /*
     * First give every existing mentor a temporary unique
     * email address.
     */
    for (let i = 0; i < mentorSchedules.length; i++) {
      const [
        name
      ] = mentorSchedules[i];

      const mentor = getMentorId.get(name);

      if (mentor) {
        setTemporaryEmail.run(
          temporaryEmails[i],
          mentor.id
        );
      }
    }

    /*
     * Now safely assign the final Gmail aliases.
     */
    for (const [
      name,
      email,
      rating,
      availabilityStart,
      availabilityEnd
    ] of mentorSchedules) {
      const mentor = getMentorId.get(name);

      if (!mentor) {
        continue;
      }

      updateMentor.run(
        email,
        rating,
        availabilityStart,
        availabilityEnd,
        mentor.id
      );
    }
  });

  updateMentors();

  // =========================================================
  // 3. COURSES / DOMAINS
  // =========================================================

  const courses = [
    [
      "Python Programming",
      "Learn Python programming fundamentals and problem solving."
    ],
    [
      "Web Development",
      "Learn frontend and web development concepts."
    ],
    [
      "AI & Machine Learning",
      "Explore artificial intelligence and machine learning concepts."
    ],
    [
      "Game Development",
      "Learn the fundamentals of creating interactive games."
    ],
    [
      "Coding & Programming",
      "Build strong programming and logical problem-solving skills."
    ],
    [
      "Data Science",
      "Learn data analysis, visualization and data science fundamentals."
    ]
  ];

  const insertCourse = db.prepare(`
    INSERT OR IGNORE INTO courses (
      name,
      description,
      active
    )
    VALUES (?, ?, 1)
  `);

  const seedCourses = db.transaction(() => {
    for (const course of courses) {
      insertCourse.run(...course);
    }
  });

  seedCourses();

  // =========================================================
  // 4. MENTOR → COURSE MAPPING
  // =========================================================

  const courseMap = {
    "Ananya Sharma": [
      "Python Programming",
      "Coding & Programming",
      "Data Science"
    ],

    "Rahul Kumar": [
      "Web Development",
      "Coding & Programming"
    ],

    "Priya Nair": [
      "AI & Machine Learning",
      "Python Programming",
      "Data Science"
    ],

    "Arjun Rao": [
      "Coding & Programming",
      "Game Development"
    ],

    "Meera Iyer": [
      "Web Development",
      "Python Programming"
    ],

    "Vikram Singh": [
      "Game Development",
      "Coding & Programming"
    ],

    "Kavya Reddy": [
      "AI & Machine Learning",
      "Data Science"
    ],

    "Aditya Joshi": [
      "Web Development",
      "Coding & Programming"
    ],

    "Sneha Menon": [
      "Python Programming",
      "AI & Machine Learning"
    ],

    "Rohan Patel": [
      "Game Development",
      "Web Development"
    ]
  };

  const getMentor = db.prepare(`
    SELECT id
    FROM mentors
    WHERE name = ?
  `);

  const getCourse = db.prepare(`
    SELECT id
    FROM courses
    WHERE name = ?
  `);

  const insertMentorCourse = db.prepare(`
    INSERT OR IGNORE INTO mentor_courses (
      mentor_id,
      course_id
    )
    VALUES (?, ?)
  `);

  const seedMentorCourses = db.transaction(() => {
    for (const [
      mentorName,
      mentorCourses
    ] of Object.entries(courseMap)) {
      const mentor = getMentor.get(mentorName);

      if (!mentor) {
        continue;
      }

      for (const courseName of mentorCourses) {
        const course = getCourse.get(courseName);

        if (!course) {
          continue;
        }

        insertMentorCourse.run(
          mentor.id,
          course.id
        );
      }
    }
  });

  seedMentorCourses();

  // =========================================================
  // 5. DEMO PARENTS
  // =========================================================

  const parentCount = db
    .prepare("SELECT COUNT(*) AS count FROM parents")
    .get().count;

  if (parentCount === 0) {
    const insertParent = db.prepare(`
      INSERT INTO parents (
        name,
        email,
        timezone
      )
      VALUES (?, ?, ?)
    `);

    const parents = [
      [
        "Demo Parent India",
        "parent.india@codeyoung.demo",
        "Asia/Kolkata"
      ],
      [
        "Demo Parent New York",
        "parent.ny@codeyoung.demo",
        "America/New_York"
      ],
      [
        "Demo Parent London",
        "parent.london@codeyoung.demo",
        "Europe/London"
      ],
      [
        "Demo Parent Los Angeles",
        "parent.la@codeyoung.demo",
        "America/Los_Angeles"
      ]
    ];

    const seedParents = db.transaction(() => {
      for (const parent of parents) {
        insertParent.run(...parent);
      }
    });

    seedParents();
  }
}