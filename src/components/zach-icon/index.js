/**
 * WordPress dependencies.
 */
import { Icon } from '@wordpress/icons';

/**
 * Local dependencies.
 */
import { library, getSVG } from './library';

const ZachIcon = ({ icon, size = 40, ...props }) => {
	const svg = getSVG(icon);
	return <Icon {...props} icon={svg} size={size} />;
};

// Export object.
export { ZachIcon };
export { library as icons };
// Export each icon.
export { default as checkIn } from './library/checkIn';
export { default as advancedCare } from './library/advancedCare';
export { default as backAndNeck } from './library/backAndNeck';
export { default as bedside } from './library/bedside';
export { default as behavioralHealth } from './library/behavioralHealth';
export { default as calendarCall } from './library/calendarCall';
export { default as calendarSchedule } from './library/calendarSchedule';
export { default as careAdvocate } from './library/careAdvocate';
export { default as careCompanion } from './library/careCompanion';
export { default as checklist } from './library/checklist';
export { default as communitySupport } from './library/communitySupport';
export { default as confirmation } from './library/confirmation';
export { default as covid19 } from './library/covid19';
export { default as discover } from './library/discover';
export { default as doctor } from './library/doctor';
export { default as drNote } from './library/drNote';
export { default as email } from './library/email';
export { default as emergencyRoom } from './library/emergencyRoom';
export { default as exercises } from './library/exercises';
export { default as faceDisappointed } from './library/faceDisappointed';
export { default as faceExcited } from './library/faceExcited';
export { default as faceHappy } from './library/faceHappy';
export { default as faceNeutral } from './library/faceNeutral';
export { default as faceSad } from './library/faceSad';
export { default as feedback } from './library/feedback';
export { default as file } from './library/file';
export { default as fitnessCardio } from './library/fitnessCardio';
export { default as getCare } from './library/getCare';
export { default as headache } from './library/headache';
export { default as healthCoach } from './library/healthCoach';
export { default as healthTips } from './library/healthTips';
export { default as information } from './library/information';
export { default as inHome } from './library/inHome';
export { default as journey } from './library/journey';
export { default as learn } from './library/learn';
export { default as mailLetter } from './library/mailLetter';
export { default as manageFamily } from './library/manageFamily';
export { default as medicalRecords } from './library/medicalRecords';
export { default as mentalHealth } from './library/mentalHealth';
export { default as messageChat } from './library/messageChat';
export { default as messageChatFCN } from './library/messageChatFCN';
export { default as messageText } from './library/messageText';
export { default as payment } from './library/payment';
export { default as paymentCash } from './library/paymentCash';
export { default as phoneAnalog } from './library/phoneAnalog';
export { default as phoneMobile } from './library/phoneMobile';
export { default as postpartumBottle } from './library/postpartumBottle';
export { default as postpartumCradle } from './library/postpartumCradle';
export { default as postpartumFeet } from './library/postpartumFeet';
export { default as prescription } from './library/prescription';
export { default as prescriptionFile } from './library/prescriptionFile';
export { default as savedDoctors } from './library/savedDoctors';
export { default as search } from './library/search';
export { default as searchNoResults } from './library/searchNoResults';
export { default as stress } from './library/stress';
export { default as thumbsDown } from './library/thumbsDown';
export { default as thumbsUp } from './library/thumbsUp';
export { default as trendDown } from './library/trendDown';
export { default as trendUp } from './library/trendUp';
export { default as urgentCare } from './library/urgentCare';
export { default as vaccine } from './library/vaccine';
export { default as virtualCare } from './library/virtualCare';
export { default as warning } from './library/warning';
