<template>
  <div>
    <section class="section is-main-section">
      <b-field grouped>
        <b-field label="Date First Added from">
          <b-datepicker
            placeholder="Date First Added from"
            icon="calendar-today"
            locale="en-CA"
            v-model="dateFirstAddedFrom"
            editable
          >
          </b-datepicker>
        </b-field>
        <b-field label="Date First Added to">
          <b-datepicker
            placeholder="Date First Added to"
            icon="calendar-today"
            locale="en-CA"
            v-model="dateFirstAddedTo"
            editable
          >
          </b-datepicker>
        </b-field>
        <b-field label="Admin score">
          <multiselect v-model="selectScores" 
          tag-placeholder="" placeholder="Select score titles" 
          label="scoreTitle" track-by="scoreID" :options="adminScores" 
          :multiple="true" :taggable="true" selectLabel="Add" deselectLabel="Remove">            
          </multiselect>
        </b-field>
        <b-field label="Mobile No">
          <b-input
            placeholder="Search mobileNo..."
            type="search"
            icon="magnify"
            v-model="filter.keyWord"
          >
          </b-input>
        </b-field>
      </b-field>

      <h5 class="subtitle is-6" v-show="isShowResult">
        <span>Found {{ customerList.length }} customer mobile numbers</span>
      </h5>
      <h5 class="subtitle is-6 has-text-white" v-show="!isShowResult">
        <span>></span>
      </h5>

      <b-field grouped>
        <p class="control pt-5 mt-2">
          <b-button
            label="Search"
            type="is-link"
            class="mr-3"
            icon-left="magnify"
            @click="getCustomerList"
            :loading="isLoading"
          />
          <b-button
            label="Reset"
            type="is-light"
            class="mr-3"
            icon-left="reload"
            @click="resetFilter"
          />
          <b-button
            label="Download result"
            class="mr-3"
            type="is-primary"
            @click="downloadCustomerExcel"
            :disabled="isDisableDownload"
          />

          <b-button
            label="Assign campaign"
            type="is-primary"
            @click="isShowCampaign = !isShowCampaign"
            :disabled="isDisableDownload"
          />
        </p>
        <b-field
          label="Select campaign"
          class="control"
          v-show="isShowCampaign"
        >
          <b-select
            placeholder="Select campaign"
            v-model="campaignModel.campaignID"
            clearable
          >
            <option
              v-for="option in adminCampaigns"
              :value="option.campaignID"
              :key="option.campaignID"
            >
              {{ option.campaignName }}
            </option>
          </b-select>
          <b-button
            label="Confirm"
            type="is-primary"
            @click="assignCampaignToCustomers"
            :disabled="!campaignModel.campaignID"
            :loading="isConfirmingCampaign"
          />
        </b-field>
      </b-field>
    </section>
  </div>
</template>

<script>
import moment from "moment";
import Multiselect from 'vue-multiselect';
import { getAdminScores, getAdminCampaigns } from "@/api/importData";
import { getCustomers, assignCampaignToCustomers } from "@/api/exportData";
export default {
  name: "ExportData",
  components: {Multiselect},
  created() {
    this.getAdminScoreList();
    this.getAdminCampaignList();
  },
  data() {
    return {
      adminScores: [],
      adminCampaigns: [],
      selectScores:[],
      campaignModel: {
        customerList: [],
        campaignID: null,
      },
      filter: {
        scoreIds: null,
        scoreCategory: null,
        keyWord: null,
        dateFirstAddedFrom: null,
        dateFirstAddedTo: null,
      },
      defaultFilter: {
        scoreIds: null,
        scoreCategory: null,
        keyWord: null,
        dateFirstAddedFrom: null,
        dateFirstAddedTo: null,
      },
      dateFirstAddedFrom: null,
      dateFirstAddedTo: null,
      customerList: [],
      isShowResult: false,
      isLoading: false,
      isShowCampaign: false,
      isConfirmingCampaign: false,
    };
  },
  computed: {
    isDisableDownload() {
      return this.customerList.length == 0;
    },
  },
  methods: {
    resetFilter() {
      this.filter = { ...this.defaultFilter };
      this.customerList = [];
      this.dateFirstAddedFrom = null;
      this.dateFirstAddedTo = null;
      this.isShowResult = false;
      this.isShowCampaign = false;
      this.selectScores=[];
    },
    getAdminScoreList() {
      //this.isLoading = true;
      getAdminScores()
        .then((response) => {
          if (response.status == 200) {
            this.adminScores = response.data;
            //console.log(this.adminScores);
          } else if (response.status == 401) {
            this.$router.push({ name: "login" });
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          //this.isLoading = false;
        });
    },
    getAdminCampaignList() {
      //this.isLoading = true;
      getAdminCampaigns()
        .then((response) => {
          if (response.status == 200) {
            this.adminCampaigns = response.data;
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          //this.isLoading = false;
        });
    },
    getCustomerList() {
      this.isLoading = true;
      const outputFormat = "YYYY-MM-DD";
      if (this.dateFirstAddedFrom)
        this.filter.dateFirstAddedFrom = moment(this.dateFirstAddedFrom).format(
          outputFormat
        );

      if (this.dateFirstAddedTo)
        this.filter.dateFirstAddedTo = moment(this.dateFirstAddedTo).format(
          outputFormat
        );
      this.filter.scoreIds= this.selectScores.map(p=>p.scoreID).join();
      getCustomers(this.filter)
        .then((response) => {
          if (response.status == 200) {
            this.customerList = response.data;
            //console.log(this.customerList);
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.isShowResult = true;
          this.isLoading = false;
          this.isShowCampaign = false;
          this.campaignModel.campaignID = null;
        });
    },
    downloadCustomerExcel() {
      console.log("downloadCustomerExcel");
      if (this.customerList.length > 0) {
        let mobileList = this.customerList.map((p) => ({
          CustomerMobileNo: p,
        }));
        this.exportExcelData(mobileList, "CustomerMobileNoList", 30, false);
      }
    },
    assignCampaignToCustomers() {
      this.campaignModel.customerList = [...this.customerList];
      this.isConfirmingCampaign = true;
      assignCampaignToCustomers(this.campaignModel)
        .then((response) => {
          if (response.status == 200) {
            this.$buefy.snackbar.open({
              message: "Assign successfully!",
              queue: false,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          // this.isShowResult = true;
          // this.isLoading = false;
          this.campaignModel.campaignID = null;
          this.isConfirmingCampaign = false;
        });
    },
  },
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style> 
