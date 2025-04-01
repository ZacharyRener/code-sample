import checkIn from './checkIn';
import advancedCare from './advancedCare';
import backAndNeck from './backAndNeck';
import bedside from './bedside';
import behavioralHealth from './behavioralHealth';
import calendarCall from './calendarCall';
import calendarSchedule from './calendarSchedule';
import careAdvocate from './careAdvocate';
import careCompanion from './careCompanion';
import checklist from './checklist';
import communitySupport from './communitySupport';
import confirmation from './confirmation';
import covid19 from './covid19';
import discover from './discover';
import doctor from './doctor';
import drNote from './drNote';
import email from './email';
import emergencyRoom from './emergencyRoom';
import exercises from './exercises';
import faceDisappointed from './faceDisappointed';
import faceExcited from './faceExcited';
import faceHappy from './faceHappy';
import faceNeutral from './faceNeutral';
import faceSad from './faceSad';
import feedback from './feedback';
import file from './file';
import fitnessCardio from './fitnessCardio';
import getCare from './getCare';
import headache from './headache';
import healthCoach from './healthCoach';
import healthTips from './healthTips';
import information from './information';
import inHome from './inHome';
import journey from './journey';
import learn from './learn';
import mailLetter from './mailLetter';
import manageFamily from './manageFamily';
import medicalRecords from './medicalRecords';
import mentalHealth from './mentalHealth';
import messageChat from './messageChat';
import messageChatFCN from './messageChatFCN';
import messageText from './messageText';
import payment from './payment';
import paymentCash from './paymentCash';
import phoneAnalog from './phoneAnalog';
import phoneMobile from './phoneMobile';
import postpartumBottle from './postpartumBottle';
import postpartumCradle from './postpartumCradle';
import postpartumFeet from './postpartumFeet';
import prescription from './prescription';
import prescriptionFile from './prescriptionFile';
import savedDoctors from './savedDoctors';
import search from './search';
import searchNoResults from './searchNoResults';
import stress from './stress';
import thumbsDown from './thumbsDown';
import thumbsUp from './thumbsUp';
import trendDown from './trendDown';
import trendUp from './trendUp';
import urgentCare from './urgentCare';
import vaccine from './vaccine';
import virtualCare from './virtualCare';
import warning from './warning';

export const library = {
	checkIn,
	advancedCare,
	backAndNeck,
	bedside,
	behavioralHealth,
	calendarCall,
	calendarSchedule,
	careAdvocate,
	careCompanion,
	checklist,
	communitySupport,
	confirmation,
	covid19,
	discover,
	doctor,
	drNote,
	email,
	emergencyRoom,
	exercises,
	faceDisappointed,
	faceExcited,
	faceHappy,
	faceNeutral,
	faceSad,
	feedback,
	file,
	fitnessCardio,
	getCare,
	headache,
	healthCoach,
	healthTips,
	information,
	inHome,
	journey,
	learn,
	mailLetter,
	manageFamily,
	medicalRecords,
	mentalHealth,
	messageChat,
	messageChatFCN,
	messageText,
	payment,
	paymentCash,
	phoneAnalog,
	phoneMobile,
	postpartumBottle,
	postpartumCradle,
	postpartumFeet,
	prescription,
	prescriptionFile,
	savedDoctors,
	search,
	searchNoResults,
	stress,
	thumbsDown,
	thumbsUp,
	trendDown,
	trendUp,
	urgentCare,
	vaccine,
	virtualCare,
	warning,
};

export const getSVG = (icon) => {
	// Sometimes we may get the icon slug, or sometimes we may get the object {label, svg}.
	if (typeof icon === 'string') {
		return svgFromIcon(icon);
	} else if (icon && typeof icon === 'object' && !Array.isArray(icon)) {
		return icon.svg;
	}
};

export const svgFromIcon = (icon) => {
	return library[icon]?.svg ?? library.doctor.svg;
};

export const labelForIcon = (icon) => {
	return library[icon]?.label ?? '';
};
