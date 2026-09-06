/**
 * ============================================================
 * ديوان عائلة الجنادا - عشيرة الزيود
 * Google Apps Script
 * ============================================================
 *
 * ترتيب أعمدة الورقة (12 عموداً - بدون عمود ID):
 * A : تاريخ التسجيل
 * B : الاسم الرباعي
 * C : الرقم الوطني
 * D : تاريخ الميلاد
 * E : الحالة الاجتماعية
 * F : المؤهل العلمي
 * G : التخصص
 * H : طبيعة العمل
 * I : مكان السكن
 * J : رقم الهاتف
 * K : نوع الدم
 * L : مشترك بالجمعية
 *
 * الإعدادات الوحيدة المطلوبة:
 *   ADMIN_PASSWORD - يجب أن تطابق VITE_ADMIN_PASSWORD في ملف .env
 *   SHEET_NAME     - اسم الورقة داخل الملف
 *
 * الإجراءات المدعومة (عبر data.action في POST):
 *   add    -> إضافة سجل جديد
 *   read   -> قراءة جميع السجلات
 *   update -> تعديل سجل (المفتاح: الرقم الوطني)
 *   delete -> حذف سجل (المفتاح: الرقم الوطني)
 *
 * ملاحظة: كل الاستجابات تُعاد بصيغة JSON فقط.
 * ============================================================
 */

/** كلمة مرور لوحة الإدارة - غيّرها قبل النشر */
var ADMIN_PASSWORD = 'Divan2024!';

/** اسم الورقة داخل Google Sheets */
var SHEET_NAME = 'Sheet1';

/**
 * تفعيل سجلات التطوير داخل Logger.
 * ضعها على false (أو احذف سطور log) بعد التأكد من عمل النظام.
 */
var DEBUG = true;

/** فهارس الأعمدة (تبدأ من صفر) - تطابق ترتيب أعمدة الورقة أعلاه */
var COL = {
  registrationDate: 0, // A
  fullName: 1, // B
  nationalId: 2, // C
  birthDate: 3, // D
  maritalStatus: 4, // E
  educationLevel: 5, // F
  specialization: 6, // G
  workNature: 7, // H
  residence: 8, // I
  phone: 9, // J
  bloodType: 10, // K
  isSocietyMember: 11, // L
};

/** إجمالي عدد الأعمدة في الورقة */
var COLUMNS_COUNT = 12;

/**
 * اسماء الحقول المعتمدة (يجب أن تطابق 100% حقول React):
 * fullName, nationalId, birthDate, maritalStatus, educationLevel,
 * specialization, workNature, residence, phone, bloodType, isSocietyMember
 */

/** نقطة الدخول الرئيسية من الواجهة (POST) */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return errorResponse('طلب غير صالح: لا توجد بيانات مرسلة', 400);
    }

    // ===== DEBUG 1) الطلب الخام كما وصل إلى الخادم =====
    Logger.log('[DEBUG doPost] 1) RAW e.postData.contents = ' + e.postData.contents);

    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (err) {
      log('تعذر تحليل البيانات المستلمة', e.postData.contents);
      return errorResponse('البيانات المرسلة ليست JSON صالح', 400);
    }

    // ===== DEBUG 2) البيانات بعد JSON.parse =====
    Logger.log('[DEBUG doPost] 2) PARSED data = ' + JSON.stringify(data));

    var action = data.action || '';
    // ===== DEBUG 3) قيمة action =====
    Logger.log('[DEBUG doPost] 3) action = "' + action + '"');

    switch (action) {
      case 'add':
        // ===== DEBUG 4) محتوى payload بالكامل =====
        Logger.log('[DEBUG doPost] 4) payload = ' + JSON.stringify(data.payload));
        return addMember(data.payload);
      case 'read':
        return readAll(data.adminKey);
      case 'update':
        return updateRow(data.adminKey, data.row);
      case 'delete':
        return deleteRow(data.adminKey, data.nationalId);
      default:
        log('إجراء غير معروف:', action);
        return errorResponse('إجراء غير معروف', 400);
    }
  } catch (err) {
    log('خطأ غير متوقع:', err && err.message);
    return errorResponse('حدث خطأ: ' + (err && err.message), 500);
  }
}

/** اختيار GET - للتأكد من عمل الخدمة */
function doGet() {
  return jsonOutput({
    success: true,
    message: 'خدمة ديوان عائلة الجنادا تعمل بنجاح',
  });
}

/* ====================== إضافة فرد ====================== */

function addMember(payload) {
  log('addMember → payload:', payload);
  if (!payload || typeof payload !== 'object') {
    return errorResponse('البيانات غير صالحة', 400);
  }

  // ===== DEBUG 5) قيمة كل حقل منفصلة (مع إظهار الفارغ بوضوح) =====
  var debugFields = [
    ['fullName', payload.fullName],
    ['nationalId', payload.nationalId],
    ['birthDate', payload.birthDate],
    ['maritalStatus', payload.maritalStatus],
    ['educationLevel', payload.educationLevel],
    ['specialization', payload.specialization],
    ['workNature', payload.workNature],
    ['residence', payload.residence],
    ['phone', payload.phone],
    ['bloodType', payload.bloodType],
    ['isSocietyMember', payload.isSocietyMember],
  ];
  for (var d = 0; d < debugFields.length; d++) {
    var fname = debugFields[d][0];
    var fval = debugFields[d][1];
    if (fval === undefined) {
      Logger.log('[DEBUG addMember] 5) Field "' + fname + '" = UNDEFINED');
    } else if (fval === null) {
      Logger.log('[DEBUG addMember] 5) Field "' + fname + '" = NULL');
    } else if (String(fval).trim() === '') {
      Logger.log('[DEBUG addMember] 5) Field "' + fname + '" = EMPTY STRING');
    } else {
      Logger.log('[DEBUG addMember] 5) Field "' + fname + '" = "' + fval + '"');
    }
  }

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
      return errorResponse(
        'يرجى تعبئة جميع الحقول المطلوبة: ' + requiredFields[i],
        400
      );
    }
  }

  var nationalId = String(payload.nationalId).trim();
  if (!/^\d{10}$/.test(nationalId)) {
    return errorResponse('الرقم الوطني يجب أن يتكون من 10 أرقام', 400);
  }

  var sheet = getSheet();
  if (!sheet) return errorResponse('لم يتم العثور على الورقة: ' + SHEET_NAME, 500);

  if (nationalIdExists(sheet, nationalId)) {
    return errorResponse('هذا الرقم الوطني مسجل مسبقاً', 409);
  }

  var rowToAppend = [
    new Date().toLocaleString('sv-SE'), // A: تاريخ التسجيل
    String(payload.fullName || '').trim(), // B: الاسم الرباعي
    nationalId, // C: الرقم الوطني
    String(payload.birthDate || '').trim(), // D: تاريخ الميلاد
    String(payload.maritalStatus || '').trim(), // E: الحالة الاجتماعية
    String(payload.educationLevel || '').trim(), // F: المؤهل العلمي
    String(payload.specialization || '').trim(), // G: التخصص
    String(payload.workNature || '').trim(), // H: طبيعة العمل
    String(payload.residence || '').trim(), // I: مكان السكن
    String(payload.phone || '').trim(), // J: رقم الهاتف
    String(payload.bloodType || '').trim(), // K: نوع الدم
    String(payload.isSocietyMember || '').trim(), // L: مشترك بالجمعية
  ];

  // ===== DEBUG 6) المصفوفة التي ستُرسل إلى Google Sheet قبل الإضافة =====
  Logger.log('[DEBUG addMember] 6) ROW array to append = ' + JSON.stringify(rowToAppend));

  sheet.appendRow(rowToAppend);

  // ===== DEBUG 7) رقم الصف الذي تم الحفظ فيه بعد الإضافة =====
  Logger.log('[DEBUG addMember] 7) SAVED at row #' + sheet.getLastRow());

  log('addMember → تمت الإضافة للرقم الوطني:', nationalId);
  return successResponse({}, 'تم تسجيل البيانات بنجاح');
}

/* ====================== قراءة كل البيانات ====================== */

function readAll(adminKey) {
  if (!checkAdmin(adminKey)) return errorResponse('كلمة المرور غير صحيحة', 403);

  var sheet = getSheet();
  if (!sheet) return errorResponse('لم يتم العثور على الورقة: ' + SHEET_NAME, 500);

  var values = sheet.getDataRange().getValues();
  var members = [];

  for (var i = 1; i < values.length; i++) {
    var v = values[i];
    if (isEmpty(v[COL.registrationDate]) && isEmpty(v[COL.fullName])) continue;

    members.push({
      registrationDate: formatRegDate(v[COL.registrationDate]),
      fullName: String(v[COL.fullName] || '').trim(),
      nationalId: String(v[COL.nationalId] || '').trim(),
      birthDate: formatBirthDate(v[COL.birthDate]),
      maritalStatus: String(v[COL.maritalStatus] || '').trim(),
      educationLevel: String(v[COL.educationLevel] || '').trim(),
      specialization: String(v[COL.specialization] || '').trim(),
      workNature: String(v[COL.workNature] || '').trim(),
      residence: String(v[COL.residence] || '').trim(),
      phone: String(v[COL.phone] || '').trim(),
      bloodType: String(v[COL.bloodType] || '').trim(),
      isSocietyMember: String(v[COL.isSocietyMember] || '').trim(),
    });
  }

  log('readAll → عدد السجلات:', members.length);
  return successResponse(members, 'تم جلب البيانات بنجاح');
}

/* ====================== تحديث سجل ====================== */

function updateRow(adminKey, row) {
  if (!checkAdmin(adminKey)) return errorResponse('كلمة المرور غير صحيحة', 403);
  if (!row || !row.nationalId) return errorResponse('رقم وطني غير صالح', 400);

  var newId = String(row.nationalId).trim();
  if (!/^\d{10}$/.test(newId)) {
    return errorResponse('الرقم الوطني يجب أن يتكون من 10 أرقام', 400);
  }

  // الرقم الوطني الأصلي قبل التعديل (للإيجاد في الورقة)
  var originalId = String((row.originalNationalId || row.nationalId) || '').trim();

  var sheet = getSheet();
  if (!sheet) return errorResponse('لم يتم العثور على الورقة: ' + SHEET_NAME, 500);

  var values = sheet.getDataRange().getValues();

  for (var i = 1; i < values.length; i++) {
    if (String(values[i][COL.nationalId]).trim() === originalId) {
      // منع التطابق مع سجل آخر عند تغيير الرقم الوطني
      for (var j = 1; j < values.length; j++) {
        if (
          j !== i &&
          String(values[j][COL.nationalId]).trim() === newId &&
          newId !== originalId
        ) {
          return errorResponse('هذا الرقم الوطني مسجل مسبقاً لشخص آخر', 409);
        }
      }

      sheet.getRange(i + 1, 1, 1, COLUMNS_COUNT).setValues([
        [
          String(
            row.registrationDate ||
              formatRegDate(values[i][COL.registrationDate])
          ), // A: تاريخ التسجيل (بما هو)
          String(row.fullName || '').trim(), // B
          newId, // C
          String(row.birthDate || '').trim(), // D
          String(row.maritalStatus || '').trim(), // E
          String(row.educationLevel || '').trim(), // F
          String(row.specialization || '').trim(), // G
          String(row.workNature || '').trim(), // H
          String(row.residence || '').trim(), // I
          String(row.phone || '').trim(), // J
          String(row.bloodType || '').trim(), // K
          String(row.isSocietyMember || '').trim(), // L
        ],
      ]);

      log('updateRow → تم تحديث الرقم الوطني:', newId);
      return successResponse({}, 'تم حفظ التعديلات بنجاح');
    }
  }

  return errorResponse('لم يتم العثور على سجل بهذا الرقم الوطني', 404);
}

/* ====================== حذف سجل ====================== */

function deleteRow(adminKey, nationalId) {
  if (!checkAdmin(adminKey)) return errorResponse('كلمة المرور غير صحيحة', 403);
  if (!nationalId) return errorResponse('رقم وطني غير صالح', 400);

  var id = String(nationalId).trim();
  var sheet = getSheet();
  if (!sheet) return errorResponse('لم يتم العثور على الورقة: ' + SHEET_NAME, 500);

  var values = sheet.getDataRange().getValues();

  for (var i = 1; i < values.length; i++) {
    if (String(values[i][COL.nationalId]).trim() === id) {
      sheet.deleteRow(i + 1);
      log('deleteRow → تم حذف الرقم الوطني:', id);
      return successResponse({}, 'تم حذف السجل بنجاح');
    }
  }

  return errorResponse('لم يتم العثور على سجل بهذا الرقم الوطني', 404);
}

/* ====================== أدوات مساعدة ====================== */

function getSheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
}

function checkAdmin(key) {
  return String(key || '').trim() === String(ADMIN_PASSWORD);
}

function nationalIdExists(sheet, nationalId) {
  var values = sheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (String(values[i][COL.nationalId]).trim() === nationalId) {
      return true;
    }
  }
  return false;
}

function isEmpty(value) {
  return value === undefined || value === null || String(value).trim() === '';
}

/** توحيد قيمة تاريخ التسجيل (قد تكون Date أو نصاً) */
function formatRegDate(value) {
  if (value instanceof Date) {
    return Utilities.formatDate(
      value,
      Session.getScriptTimeZone(),
      'yyyy-MM-dd HH:mm:ss'
    );
  }
  return String(value || '').trim();
}

/** توحيد قيمة تاريخ الميلاد بصيغة yyyy-MM-dd (كما يرسلها النموذج) */
function formatBirthDate(value) {
  if (value instanceof Date) {
    return Utilities.formatDate(
      value,
      Session.getScriptTimeZone(),
      'yyyy-MM-dd'
    );
  }
  return String(value || '').trim();
}

/** سجل تطوير يتوقف تلقائياً عند إيقاف DEBUG */
function log(label, value) {
  if (!DEBUG) return;
  var str;
  try {
    str = typeof value === 'string' ? value : JSON.stringify(value);
  } catch (err) {
    str = String(value);
  }
  Logger.log(label + ' ' + str);
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