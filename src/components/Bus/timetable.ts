export type BusSchedule = {
time: string;
destination: string;
};

export const WEEKDAY_TIMETABLE: BusSchedule[] = [
{ time: "09:05", destination: "55A 函館駅前行き" },
{ time: "10:41", destination: "55G 昭和方面行き" },
{ time: "11:35", destination: "55H 亀田支所行き" },
{ time: "12:23", destination: "55G 昭和方面行き" },
{ time: "13:44", destination: "55G 昭和方面行き" },
{ time: "14:52", destination: "55G 昭和方面行き" },
{ time: "16:03", destination: "55F 五稜郭方面行き" },
{ time: "16:33", destination: "55A 五稜郭方面行き" },
{ time: "16:59", destination: "55G 昭和方面行き" },
{ time: "17:41", destination: "55A 五稜郭方面行き" },
{ time: "18:17", destination: "55F 五稜郭方面行き" },
{ time: "18:47", destination: "55A 五稜郭方面行き" },
{ time: "18:52", destination: "55G 昭和方面行き" },
{ time: "19:55", destination: "55F 五稜郭方面行き" },
{ time: "20:41", destination: "55G 昭和方面行き" },
];

export const WEEKEND_TIMETABLE: BusSchedule[] = [
{ time: "09:46", destination: "55A 五稜郭方面行き" },
{ time: "12:13", destination: "55H 亀田支所行き" },
{ time: "13:08", destination: "55H 亀田支所行き" },
{ time: "14:45", destination: "55A 五稜郭方面行き" },
{ time: "15:35", destination: "55A 五稜郭方面行き" },
{ time: "16:33", destination: "55A 五稜郭方面行き" },
{ time: "18:04", destination: "55A 五稜郭方面行き" },
{ time: "19:24", destination: "55H 亀田支所行き" },
];