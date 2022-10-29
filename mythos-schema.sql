create table if not exists "mercury_user_data" (
    "id" bigint primary key not null,
    "player_id" bigint not null
            references "aime_player"("id")
            on delete cascade,
    "ext_id" integer not null,
    "user_name" text not null,
    "type" smallint not null default 1,
    "exp" integer not null default 0,
    "points" integer not null default 500,
    "login_count" integer not null default 0,
    "login_day_count" integer not null default 0,
    "login_streak" integer not null default 0,
    "login_day_streak" integer not null default 0,
    "login_today_count" integer not null default 0,
    "last_login" timestamp not null default current_timestamp,
    "vip_expires" timestamp not null default 0,
    "favorite_music" jsonb not null,
    constraint "mercury_user_data_uq" unique ("ext_id")
);

create table if not exists "mercury_user_item" (
    "id" bigint primary key not null,
    "profile_id" bigint not null
            references "mercury_user_data"("id")
            on delete cascade,
    "item_kind" integer not null,
    "item_id" integer not null,
    "value" integer not null,
    "unlock_date" timestamp not null default current_timestamp,
    "use_count" integer not null default 0,
    "extra_data" jsonb,
    constraint "mercury_user_item_uq" unique (
            "profile_id",
            "item_kind",
            "item_id"
    )
);

create table if not exists "mercury_user_mission" (
    "id" bigint primary key not null,
    "profile_id" bigint not null
            references "mercury_user_data"("id")
            on delete cascade,
    "page" integer not null,
    "progress" jsonb not null,
    constraint "mercury_user_mission_uq" unique ("profile_id")
);

create table if not exists "mercury_user_music" (
    "id" bigint primary key not null,
    "profile_id" bigint not null
            references "mercury_user_data"("id")
            on delete cascade,
    "music_id" integer not null,
    "music_difficulty" integer not null,
    "score" integer not null,
    "combo" integer not null,
    "miss_count" integer not null,
    "skill_points" integer not null,
    "play_count" integer not null,
    "clear_count" integer not null,
    "missless_count" integer not null,
    "full_combo_count" integer not null,
    "all_marvelous_count" integer not null,
    "grade" integer not null,
    "rating" integer not null,
    constraint "mercury_user_music_uq" unique (
            "profile_id",
            "music_id",
            "music_difficulty"
    )
);

create table if not exists "mercury_user_option" (
    "id" bigint primary key not null,
    "profile_id" bigint not null
            references "mercury_user_data"("id")
            on delete cascade,
    "version" integer not null,
    "option_id" integer not null,
    "value" integer not null,
    constraint "mercury_user_option_uq" unique (
            "profile_id",
            "version",
            "option_id"
    )
);

create table if not exists "mercury_user_playlog" (
    "id" bigint primary key not null,
    "profile_id" bigint not null
            references "mercury_user_data"("id")
            on delete cascade,
    "place_id" integer not null,
    "place_name" text not null,
    "music_id" integer not null,
    "music_difficulty" integer not null,
    "track" integer not null,
    "score" integer not null,
    "judge_marvelous" integer not null,
    "judge_great" integer not null,
    "judge_good" integer not null,
    "judge_miss" integer not null,
    "is_clear" boolean not null,
    "is_missless" boolean not null,
    "is_full_combo" boolean not null,
    "is_all_marvelous" boolean not null,
    "is_give_up" boolean not null,
    "is_new_record" boolean not null,
    "grade" integer not null,
    "combo" integer not null,
    "skill_points" integer not null,
    "fast" integer not null,
    "late" integer not null,
    "unlocks" jsonb not null
);

create table if not exists "mercury_user_sugoroku" (
    "id" bigint primary key not null,
    "profile_id" bigint not null
            references "mercury_user_data"("id")
            on delete cascade,
    "sugoroku_id" integer not null,
    "sugoroku_type" integer not null,
    "page" integer not null,
    "progress" integer not null,
    "loop_count" integer not null,
    "last_updated" timestamp not null,
    "total_points" integer not null,
    "mission_flag" integer not null,
    constraint "mercury_user_sugoroku_uq" unique (
            "profile_id",
            "sugoroku_id"
    )
);

create table if not exists "mercury_user_version_data" (
    "id" bigint primary key not null,
    "profile_id" bigint not null
            references "mercury_user_data"("id")
            on delete cascade,
    "version" integer not null,
    "rank" integer not null default 0,
    "dan_rank" integer not null default 0,
    "title_part_ids" jsonb not null default '[0, 0, 0]',
    "rating" integer not null default 0,
    "last_app_version" text not null,
    "last_song" jsonb not null default '{"id": 0, "difficulty": 0}',
    "last_folder_sort" integer not null default 0,
    "last_folder" integer not null default 0,
    "last_song_sort" integer not null default 0,
    "last_browsed_song_list" timestamp not null default 0,
    "tutorial_state" jsonb not null,
    constraint "mercury_user_version_data_uq" unique ("profile_id", "version")
);

create table if not exists "mercury_user_version_item" (
    "id" bigint primary key not null,
    "profile_id" bigint not null
            references "mercury_user_data"("id")
            on delete cascade,
    "version" integer not null,
    "item_kind" integer not null,
    "item_id" integer not null,
    "use_count" integer not null default 0,
    constraint "mercury_user_version_item_uq" unique (
            "profile_id",
            "version",
            "item_kind",
            "item_id"
    )
);

