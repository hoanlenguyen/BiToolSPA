<template>
  <div>
    <section class="section is-main-section">
      <b-field class="file is-primary" :class="{ 'has-name': !!file }">
        <b-upload
          v-model="file"
          class="file-label"
          :loading="isLoadProcessExcel"
        >
          <span class="file-cta">
            <b-icon class="file-icon" icon="upload"></b-icon>
            <span class="file-label">Click to upload</span>
          </span>
          <span class="file-name" v-if="file">
            {{ file.name }}
          </span>
        </b-upload>
      </b-field>
      <b-button type="is-info" @click="importData" :loading="isLoading"
        >Import Data</b-button
      >
    </section>
  </div>
</template>

<script>
//import XLSX from 'xlsx';
import readXlsxFile from "read-excel-file";
import moment from "moment";
import { importCustomerScore, getAdminScores } from "@/api/importData";
export default {
  name: "ImportData",
  components: {},
  created() {
    this.getAdminScoreList();
  },
  data() {
    return {
      file: null,
      model: {
        customerList: [],
      },
      errorList: [],
      adminScores: [],
      adminScoreTitles: [],
      isLoadProcessExcel: false,
      isLoading: false,
    };
  },
  watch: {
    file(val) {
      if (val) {
        this.readFileData(val);
      }
    },
  },
  methods: {
    getAdminScoreList() {
      this.isLoading = true;
      getAdminScores()
        .then((response) => {
          if (response.status == 200) {
            this.adminScores = response.data;
            this.adminScoreTitles = this.adminScores.map((p) =>
              p.scoreTitle.toLowerCase()
            );
            //console.log(this.adminScoreTitles);
            //console.log(this.adminScores);
          } else if (response.status == 401) {
            this.$router.push({ name: "login" });
          }
        })
        .catch((error) => {
          //console.log(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    readFileData(data) {
      this.isLoadProcessExcel=true;
      const schema = {
        "Date Occurred": {
          prop: "dateOccurred",
          type: String,
        },
        "Customer Mobile No": {
          prop: "customerMobileNo",
          type: String,
        },
        "Score Title": {
          prop: "scoreTitle",
          type: String,
        },
      };
      const inputFormat = "DD/MM/YYYY";
      const outputFormat = "YYYY-MM-DD";
      var isValidDate = true;
      var isValidPhoneNumber = true;
      var isValidScoreTiltles = true;
      readXlsxFile(data, { schema }).then(({ rows, errors }) => {
        rows.forEach((element, index) => {
          console.log(element);
          isValidScoreTiltles = this.adminScoreTitles.some((v) =>
            v.includes(element.scoreTitle)
          );
          isValidDate = moment(
            element.dateOccurred,
            inputFormat,
            true
          ).isValid();
          isValidPhoneNumber = this.checkValidPhoneNumber(
            element.customerMobileNo
          );
          element.dateOccurred = moment(
            element.dateOccurred,
            inputFormat
          ).format(outputFormat);
          if (!isValidDate)
            this.errorList.push(`Cell A${index} - date invalid`);

          if (!isValidPhoneNumber)
            this.errorList.push(`Cell B${index} - mobile number invalid`);

          if (!isValidScoreTiltles)
            this.errorList.push(`Cell C${index} - score title invalid`);

          this.model.customerList.push(element);
          // if (isValidScoreTiltles && isValidDate && isValidPhoneNumber) {
          //   this.model.customerList.push(element);
          // }
        });
        console.log(this.model.customerList);
        console.log(this.errorList);
        this.isLoadProcessExcel=false;
      });
    },
    importData() {
      this.isLoading = true;
      importCustomerScore(this.model)
        .then((response) => {
          if (response.status == 200) {
            this.$buefy.snackbar.open({
              message: "Import successfully!",
              queue: false,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          // this.$buefy.snackbar.open({
          //   message: error.error,
          //   queue: false
          // });
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    downloadErrorListExcel() {
      console.log("downloadErrorListExcel");
      if (this.errorList.length > 0) {
        let excelList = this.customerList.map((p) => ({
          errorDetail: p,
        }));
        this.exportExcelData(excelList, "ErrorList", 30);
      }
    },
    checkValidPhoneNumber(input) {
      if(!input) return false;
      if (input.length != 9) return false;
      var firstChar = input[0];
      if (firstChar != "6" && firstChar != "8" && firstChar != "9")
        return false;
      const parsed = parseInt(input);
      return !isNaN(parsed);
    }
  },
};
</script>
