import XLSX from "xlsx-js-style";
import moment from "moment";
var myMixin = {
    methods: {
        exportExcelData(data, excelName, wch = null, isAddHeader=true) {
            var workSheet =isAddHeader? XLSX.utils.json_to_sheet(data): XLSX.utils.json_to_sheet(data, {skipHeader: 1});
            if (wch && data && data.length) {
                var size = Object.keys(data[0]).length;
                if (size) {
                var wscols = Array(size).fill({ wch: wch });
                workSheet["!cols"] = wscols;
                }
            }
            var wb = XLSX.utils.book_new(); // make Workbook of Excel
            XLSX.utils.book_append_sheet(wb, workSheet, "Sheet1"); // sheetAName is name of Worksheet
            XLSX.writeFile(
                wb,
                `${excelName}_${moment(new Date()).format("DD/MM/YYYY hh:mm:ss")}.xlsx`
            ); // name of the file is 'book.xlsx'
          },
    }
}
export default myMixin;