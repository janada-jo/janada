/**
 * ============================================================
 * ديوان عائلة الجنادا - عشيرة الزيود
 * Google Apps Script
 * ============================================================
 *
 * ترتيب أعمدة الورقة:
 * A | B | C | D | E | F | G | H | I | J | K | L | M
 * ID | تاريخ التسجيل | الاسم الرباعي | الرقم الوطني | تاريخ الميلاد |
 * الحالة الاجتماعية | المؤهل العلمي | التخصص | طبيعة العمل | مكان السكن |
 * رقم الهاتف | نوع الدم | مشترك بالجمعية
 *
 * ============================================================
 * الإعدادات الوحيدة المطلوبة:
 *   ADMIN_PASSWORD - يجب أن تطابق VITE_ADMIN_PASSWORD في ملف .env
 *   SHEET_NAME     - اسم الورقة داخل الملف
 * ============================================================
 */

/** كلمة مرور لوحة الإدارة - غيّرها قبل النشر */
var ADMIN_PASSWORD = 'Divan2024!';

/** اسم الورقة داخل Google Sheets */
var SHEET_NAME = 'Sheet1';

/** نقطة الدخول الرئيسية من الواجهة */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action || '';

    switch (action) {
      case 'add':
        return addMember(data.payload);
      case 'readAll':
        return readAll(data.adminKey);
      case 'update':
        return updateRow(data.adminKey, data.row);
      case 'delete':
        return deleteRow(data.adminKey, data.id);
      default:
        return errorResponse('إجراء غير معروف', 400);
    }
  } catch (err) {
    return errorResponse('حدث خطأ: ' + err.message, 500);
  }
}

/** اختيار GET - لتأكيد عمل الخدمة */
function doGet() {
  return jsonOutput({
    success: true,
    message: 'خدمة ديوان عائلة الجنادا تعمل بنجاح',
  });
}

/* ====================== إضافة فرد ====================== */

function addMember(payload) {
  if (!payload) return errorResponse('البيانات غير صالحة', 400);

  var requiredFields = [
    'fullName',
    'nationalId',
    'birthDate',
    'maritalStatus',
    'educationLevel',
    'workNature',
    'residence',
    'phone',
    'bloodType',
    'isSocietyMember',
  ];

  for (var i = 0; i < requiredFields.length; i++) {
    if (isEmpty(payload[requiredFields[i]])) {
      return errorResponse('يرجى تعبئة جميع الحقول المطلوبة', 400);
    }
  }

  var nationalId = String(payload.nationalId).trim();
  if (!/^\d{10}$/.test(nationalId)) {
    return errorResponse('الرقم الوطني يجب أن يتكون من 10 أرقام', 400);
  }

  var sheet = getSheet();

  // منع التكرار: الرقم الوطني في العمود D
  if (nationalIdExists(sheet, nationalId)) {
    return errorResponse('هذا الرقم الوطني مسجل مسبقاً', 409);
  }

  sheet.appendRow([
    generateId(),
    new Date().toLocaleString('sv-SE'),
    String(payload.fullName || '').trim(),
    nationalId,
    String(payload.birthDate || ''),
    String(payload.maritalStatus || ''),
    String(payload.educationLevel || ''),
    String(payload.specialization || '').trim(),
    String(payload.workNature || ''),
    String(payload.residence || '').trim(),
    String(payload.phone || '').trim(),
    String(payload.bloodType || ''),
    String(payload.isSocietyMember || ''),
  ]);

  return successResponse({}, 'تم تسجيل البيانات بنجاح');
}

/* ====================== قراءة كل البيانات ====================== */

function readAll(adminKey) {
  if (!checkAdmin(adminKey)) return errorResponse('كلمة المرور غير صحيحة', 403);

  var sheet = getSheet();
  var values = sheet.getDataRange().getValues();
  var members = [];

  for (var i = 1; i < values.length; i++) {
    var v = values[i];
    if (isEmpty(v[0]) && isEmpty(v[2])) continue;

    members.push({
      id: String(v[0] || ''),
      registrationDate: String(v[1] || ''),
      fullName: String(v[2] || ''),
      nationalId: String(v[3] || ''),
      birthDate: String(v[4] || ''),
      maritalStatus: String(v[5] || ''),
      educationLevel: String(v[6] || ''),
      specialization: String(v[7] || ''),
      workNature: String(v[8] || ''),
      residence: String(v[9] || ''),
      phone: String(v[10] || ''),
      bloodType: String(v[11] || ''),
      isSocietyMember: String(v[12] || ''),
    });
  }

  return successResponse(members, 'تم جلب البيانات بنجاح');
}

/* ====================== تحديث سجل ====================== */

function updateRow(adminKey, row) {
  if (!checkAdmin(adminKey)) return errorResponse('كلمة المرور غير صحيحة', 403);
  if (!row || !row.id) return errorResponse('معرف غير صالح', 400);

  var sheet = getSheet();
  var values = sheet.getDataRange().getValues();

  for (var i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(row.id)) {
      sheet.getRange(i + 1, 1, 1, 13).setValues([
        [
          String(row.id || ''),
          String(values[i][1] || row.registrationDate || ''),
          String(row.fullName || ''),
          String(row.nationalId || ''),
          String(row.birthDate || ''),
          String(row.maritalStatus || ''),
          String(row.educationLevel || ''),
          String(row.specialization || ''),
          String(row.workNature || ''),
          String(row.residence || ''),
          String(row.phone || ''),
          String(row.bloodType || ''),
          String(row.isSocietyMember || ''),
        ],
      ]);
      return successResponse({}, 'تم حفظ التعديلات بنجاح');
    }
  }

  return errorResponse('لم يتم العثور على السجل', 404);
}

/* ====================== حذف سجل ====================== */

function deleteRow(adminKey, id) {
  if (!checkAdmin(adminKey)) return errorResponse('كلمة المرور غير صحيحة', 403);
  if (!id) return errorResponse('معرف غير صالح', 400);

  var sheet = getSheet();
  var values = sheet.getDataRange().getValues();

  for (var i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(id)) {
      sheet.deleteRow(i + 1);
      return successResponse({}, 'تم حذف السجل بنجاح');
    }
  }

  return errorResponse('لم يتم العثور على السجل', 404);
}

/* ====================== أدوات مساعدة ====================== */

function getSheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
}

function checkAdmin(key) {
  return String(key || '') === String(ADMIN_PASSWORD);
}

function nationalIdExists(sheet, nationalId) {
  var values = sheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (String(values[i][3]).trim() === nationalId) {
      return true;
    }
  }
  return false;
}

function isEmpty(value) {
  return value === undefined || value === null || String(value).trim() === '';
}

function generateId() {
  return (
    'M' +
    new Date().getTime().toString(36) +
    Math.random().toString(36).slice(2, 8)
  );
}

/* ====================== تنسيق الردود ====================== */

function successResponse(data, message) {
  return jsonOutput({ success: true, message: message, data: data });
}

function errorResponse(message, status) {
  return jsonOutput({ success: false, message: message, status: status });
}

function jsonOutput(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}