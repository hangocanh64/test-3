// ==========================================================================================
// note
//
// pageによる差異
// /reservation-list
// calendar_grid_time
//
// 他、予約登録
// /qeeg,/psychiatry,/consultation
// schedule_grid_time
//
// TMS 時間が20分毎のためid名区別
// /tms
// schedule_grid_tms_time
// ==========================================================================================
$(document).ready(function () {
    // 時間経過により対象class名切り替わった際、1つ前のclass名('time_' + name_array[i])を操作できるよう格納
    let oldClassName;
    let oldClassNameTms;
    var curentTime = getCurrentTimestamp();
    var currentDate = new Date().toISOString().slice(0, 10);

    function getCurrentTimestamp() {
        var curDate = new Date();
        var hours = curDate.getHours();
        var minutes = curDate.getMinutes();
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        var time = String(hours) + String(minutes);
        return Number(time);
    }

    // 現在時刻の範囲にある行をハイライト
    function displayHightLight() {
        var selectedDate = document.getElementById('hidden_select-date');
        var name_array = [1000, 1030, 1100, 1130, 1200, 1230, 1300, 1330, 1400, 1430, 1500, 1530, 1600, 1630, 1700, 1730, 1800, 1830, 1900, 1930, 2000, 2030, 2100, 2130, 2200];
        for (var i = 0; i < name_array.length; i++) {
            if (selectedDate) {
                if (selectedDate.value == currentDate) {
                    setClassGridTime(curentTime, name_array[i]);
                }
            } else {
                setClassGridTime(curentTime, name_array[i]);
            }
        }
    }

    // 現在時刻の範囲にある行をハイライト(/tms)
    function displayHightLightTms() {
        var name_array = [1000, 1020, 1040, 1100, 1120, 1140, 1200, 1220, 1240, 1300, 1320, 1340, 1400, 1420, 1440, 1500, 1520, 1540, 1600, 1620, 1640, 1700, 1720, 1740, 1800, 1820, 1840, 1900, 1920, 1940];
        var className;
        for (var i = 0; i < name_array.length; i++) {
            if (curentTime - name_array[i] >= -1 && curentTime - name_array[i] < 19) {
                $('#schedule_grid_tms_time').removeClass(oldClassNameTms);
                className = 'time_' + name_array[i];

                $('#schedule_grid_tms_time').addClass(className);
                oldClassNameTms = className;
            } else if (name_array[i] - curentTime == 41) {
                $('#schedule_grid_tms_time').removeClass(oldClassNameTms);
                className = 'time_' + name_array[i];

                $('#schedule_grid_tms_time').addClass(className);
                oldClassNameTms = className;
            }
        }
    }

    function setClassGridTime(curentTime, time) {
        var className;
        if (curentTime - time >= -1 && curentTime - time < 29) {
            removeOldClassFromGridTime()
            className = 'time_' + time;
            addClassToGridTime(className);
            oldClassName = className;
        } else if (time - curentTime == 41) {
            removeOldClassFromGridTime()
            className = 'time_' + time;
            addClassToGridTime(className);
            oldClassName = className;
        }
    }

    // 過去の日時は新規登録不可 グレーアウトと登録モーダルの表示を制限
    function disableBeforeNow() {
        // /reservation-list
        let now = moment();
        document.querySelectorAll('[id^=js-handler-frame_]').forEach(function (e) {
            let id_datetime = e.id.replace("js-handler-frame_", "").split("_");
            let frame_time = moment(id_datetime[0] + ' ' + id_datetime[1].slice(1, 3) + ':' + id_datetime[1].slice(3, 5))
            if (frame_time.isSameOrBefore(now)) {
                // reservation-list.js 枠クリックhandlerにて class名利用でモーダル表示を制限
                e.classList.add('disable_before_now');
                e.style.backgroundColor = '#ccc';
            }
        });
        // /qeeg,/tms,/psychiatry,/consultation
        document.querySelectorAll('[id^=js-new_schedule_btn_]').forEach(function (e) {
            let id_datetime = e.id.replace("js-new_schedule_btn_", "").split("_");
            let frame_time = moment(id_datetime[0] + ' ' + id_datetime[1].slice(0, 2) + ':' + id_datetime[1].slice(3, 5))
            if (frame_time.isSameOrBefore(now)) {
                // 新規登録ボタン非表示
                e.style.display = 'none';
                e.parentElement.style.backgroundColor = '#ccc';
            }
        });
    }

    function removeOldClassFromGridTime() {
        $("#calendar_grid_time").removeClass(oldClassName);
        $('#schedule_grid_time').removeClass(oldClassName);
    }

    function addClassToGridTime(className) {
        $("#calendar_grid_time").addClass(className);
        $('#schedule_grid_time').addClass(className);
    }

    // setTimeout,setIntervalによる操作を行う関数群
    // 現在時刻の範囲にある行をハイライト,現在時刻の範囲にある行をハイライト(/tms),現在時刻より前の行を無効化
    function variousControlsByTime() {
        displayHightLight();
        displayHightLightTms();
        disableBeforeNow();
    }

    disableBeforeNow();
    setTimeout(function () {
        variousControlsByTime();
        setInterval(function () {
            variousControlsByTime();
        }, 1000);
    }, 1000)
});
