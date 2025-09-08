const ratingBorders = [
  {
    "min": 1000000,
    "multiplier": 1.1
  },
  {
    "min": 999900,
    "multiplier": 1.0995
  },
  {
    "min": 999800,
    "multiplier": 1.099
  },
  {
    "min": 999700,
    "multiplier": 1.0985
  },
  {
    "min": 999600,
    "multiplier": 1.098
  },
  {
    "min": 999500,
    "multiplier": 1.0975
  },
  {
    "min": 999400,
    "multiplier": 1.097
  },
  {
    "min": 999300,
    "multiplier": 1.0965
  },
  {
    "min": 999200,
    "multiplier": 1.096
  },
  {
    "min": 999100,
    "multiplier": 1.0955
  },
  {
    "min": 999000,
    "multiplier": 1.095
  },
  {
    "min": 998900,
    "multiplier": 1.0945
  },
  {
    "min": 998800,
    "multiplier": 1.094
  },
  {
    "min": 998700,
    "multiplier": 1.0935
  },
  {
    "min": 998600,
    "multiplier": 1.093
  },
  {
    "min": 998500,
    "multiplier": 1.0925
  },
  {
    "min": 998400,
    "multiplier": 1.092
  },
  {
    "min": 998300,
    "multiplier": 1.0915
  },
  {
    "min": 998200,
    "multiplier": 1.091
  },
  {
    "min": 998100,
    "multiplier": 1.0905
  },
  {
    "min": 998000,
    "multiplier": 1.09
  },
  {
    "min": 997900,
    "multiplier": 1.0895
  },
  {
    "min": 997800,
    "multiplier": 1.089
  },
  {
    "min": 997700,
    "multiplier": 1.0885
  },
  {
    "min": 997600,
    "multiplier": 1.088
  },
  {
    "min": 997500,
    "multiplier": 1.0875
  },
  {
    "min": 997400,
    "multiplier": 1.087
  },
  {
    "min": 997300,
    "multiplier": 1.0865
  },
  {
    "min": 997200,
    "multiplier": 1.086
  },
  {
    "min": 997100,
    "multiplier": 1.0855
  },
  {
    "min": 997000,
    "multiplier": 1.085
  },
  {
    "min": 996900,
    "multiplier": 1.0845
  },
  {
    "min": 996800,
    "multiplier": 1.084
  },
  {
    "min": 996700,
    "multiplier": 1.0835
  },
  {
    "min": 996600,
    "multiplier": 1.083
  },
  {
    "min": 996500,
    "multiplier": 1.0825
  },
  {
    "min": 996400,
    "multiplier": 1.082
  },
  {
    "min": 996300,
    "multiplier": 1.0815
  },
  {
    "min": 996200,
    "multiplier": 1.081
  },
  {
    "min": 996100,
    "multiplier": 1.0805
  },
  {
    "min": 996000,
    "multiplier": 1.08
  },
  {
    "min": 995900,
    "multiplier": 1.0795
  },
  {
    "min": 995800,
    "multiplier": 1.079
  },
  {
    "min": 995700,
    "multiplier": 1.0785
  },
  {
    "min": 995600,
    "multiplier": 1.078
  },
  {
    "min": 995500,
    "multiplier": 1.0775
  },
  {
    "min": 995400,
    "multiplier": 1.077
  },
  {
    "min": 995300,
    "multiplier": 1.0765
  },
  {
    "min": 995200,
    "multiplier": 1.076
  },
  {
    "min": 995100,
    "multiplier": 1.0755
  },
  {
    "min": 995000,
    "multiplier": 1.075
  },
  {
    "min": 994900,
    "multiplier": 1.0745
  },
  {
    "min": 994800,
    "multiplier": 1.074
  },
  {
    "min": 994700,
    "multiplier": 1.0735
  },
  {
    "min": 994600,
    "multiplier": 1.073
  },
  {
    "min": 994500,
    "multiplier": 1.0725
  },
  {
    "min": 994400,
    "multiplier": 1.072
  },
  {
    "min": 994300,
    "multiplier": 1.0715
  },
  {
    "min": 994200,
    "multiplier": 1.071
  },
  {
    "min": 994100,
    "multiplier": 1.0705
  },
  {
    "min": 994000,
    "multiplier": 1.07
  },
  {
    "min": 993900,
    "multiplier": 1.0695
  },
  {
    "min": 993800,
    "multiplier": 1.069
  },
  {
    "min": 993700,
    "multiplier": 1.0685
  },
  {
    "min": 993600,
    "multiplier": 1.068
  },
  {
    "min": 993500,
    "multiplier": 1.0675
  },
  {
    "min": 993400,
    "multiplier": 1.067
  },
  {
    "min": 993300,
    "multiplier": 1.0665
  },
  {
    "min": 993200,
    "multiplier": 1.066
  },
  {
    "min": 993100,
    "multiplier": 1.0655
  },
  {
    "min": 993000,
    "multiplier": 1.065
  },
  {
    "min": 992900,
    "multiplier": 1.0645
  },
  {
    "min": 992800,
    "multiplier": 1.064
  },
  {
    "min": 992700,
    "multiplier": 1.0635
  },
  {
    "min": 992600,
    "multiplier": 1.063
  },
  {
    "min": 992500,
    "multiplier": 1.0625
  },
  {
    "min": 992400,
    "multiplier": 1.062
  },
  {
    "min": 992300,
    "multiplier": 1.0615
  },
  {
    "min": 992200,
    "multiplier": 1.061
  },
  {
    "min": 992100,
    "multiplier": 1.0605
  },
  {
    "min": 992000,
    "multiplier": 1.06
  },
  {
    "min": 991900,
    "multiplier": 1.0595
  },
  {
    "min": 991800,
    "multiplier": 1.059
  },
  {
    "min": 991700,
    "multiplier": 1.0585
  },
  {
    "min": 991600,
    "multiplier": 1.058
  },
  {
    "min": 991500,
    "multiplier": 1.0575
  },
  {
    "min": 991400,
    "multiplier": 1.057
  },
  {
    "min": 991300,
    "multiplier": 1.0565
  },
  {
    "min": 991200,
    "multiplier": 1.056
  },
  {
    "min": 991100,
    "multiplier": 1.0555
  },
  {
    "min": 991000,
    "multiplier": 1.055
  },
  {
    "min": 990900,
    "multiplier": 1.0545
  },
  {
    "min": 990800,
    "multiplier": 1.054
  },
  {
    "min": 990700,
    "multiplier": 1.0535
  },
  {
    "min": 990600,
    "multiplier": 1.053
  },
  {
    "min": 990500,
    "multiplier": 1.0525
  },
  {
    "min": 990400,
    "multiplier": 1.052
  },
  {
    "min": 990300,
    "multiplier": 1.0515
  },
  {
    "min": 990200,
    "multiplier": 1.051
  },
  {
    "min": 990100,
    "multiplier": 1.0505
  },
  {
    "min": 990000,
    "multiplier": 1.05
  },
  {
    "min": 989900,
    "multiplier": 1.0495
  },
  {
    "min": 989800,
    "multiplier": 1.049
  },
  {
    "min": 989700,
    "multiplier": 1.0485
  },
  {
    "min": 989600,
    "multiplier": 1.048
  },
  {
    "min": 989500,
    "multiplier": 1.0475
  },
  {
    "min": 989400,
    "multiplier": 1.047
  },
  {
    "min": 989300,
    "multiplier": 1.0465
  },
  {
    "min": 989200,
    "multiplier": 1.046
  },
  {
    "min": 989100,
    "multiplier": 1.0455
  },
  {
    "min": 989000,
    "multiplier": 1.045
  },
  {
    "min": 988900,
    "multiplier": 1.0445
  },
  {
    "min": 988800,
    "multiplier": 1.044
  },
  {
    "min": 988700,
    "multiplier": 1.0435
  },
  {
    "min": 988600,
    "multiplier": 1.043
  },
  {
    "min": 988500,
    "multiplier": 1.0425
  },
  {
    "min": 988400,
    "multiplier": 1.042
  },
  {
    "min": 988300,
    "multiplier": 1.0415
  },
  {
    "min": 988200,
    "multiplier": 1.041
  },
  {
    "min": 988100,
    "multiplier": 1.0405
  },
  {
    "min": 988000,
    "multiplier": 1.04
  },
  {
    "min": 987900,
    "multiplier": 1.0395
  },
  {
    "min": 987800,
    "multiplier": 1.039
  },
  {
    "min": 987700,
    "multiplier": 1.0385
  },
  {
    "min": 987600,
    "multiplier": 1.038
  },
  {
    "min": 987500,
    "multiplier": 1.0375
  },
  {
    "min": 987400,
    "multiplier": 1.037
  },
  {
    "min": 987300,
    "multiplier": 1.0365
  },
  {
    "min": 987200,
    "multiplier": 1.036
  },
  {
    "min": 987100,
    "multiplier": 1.0355
  },
  {
    "min": 987000,
    "multiplier": 1.035
  },
  {
    "min": 986900,
    "multiplier": 1.0345
  },
  {
    "min": 986800,
    "multiplier": 1.034
  },
  {
    "min": 986700,
    "multiplier": 1.0335
  },
  {
    "min": 986600,
    "multiplier": 1.033
  },
  {
    "min": 986500,
    "multiplier": 1.0325
  },
  {
    "min": 986400,
    "multiplier": 1.032
  },
  {
    "min": 986300,
    "multiplier": 1.0315
  },
  {
    "min": 986200,
    "multiplier": 1.031
  },
  {
    "min": 986100,
    "multiplier": 1.0305
  },
  {
    "min": 986000,
    "multiplier": 1.03
  },
  {
    "min": 985900,
    "multiplier": 1.0295
  },
  {
    "min": 985800,
    "multiplier": 1.029
  },
  {
    "min": 985700,
    "multiplier": 1.0285
  },
  {
    "min": 985600,
    "multiplier": 1.028
  },
  {
    "min": 985500,
    "multiplier": 1.0275
  },
  {
    "min": 985400,
    "multiplier": 1.027
  },
  {
    "min": 985300,
    "multiplier": 1.0265
  },
  {
    "min": 985200,
    "multiplier": 1.026
  },
  {
    "min": 985100,
    "multiplier": 1.0255
  },
  {
    "min": 985000,
    "multiplier": 1.025
  },
  {
    "min": 984900,
    "multiplier": 1.0245
  },
  {
    "min": 984800,
    "multiplier": 1.024
  },
  {
    "min": 984700,
    "multiplier": 1.0235
  },
  {
    "min": 984600,
    "multiplier": 1.023
  },
  {
    "min": 984500,
    "multiplier": 1.0225
  },
  {
    "min": 984400,
    "multiplier": 1.022
  },
  {
    "min": 984300,
    "multiplier": 1.0215
  },
  {
    "min": 984200,
    "multiplier": 1.021
  },
  {
    "min": 984100,
    "multiplier": 1.0205
  },
  {
    "min": 984000,
    "multiplier": 1.02
  },
  {
    "min": 983900,
    "multiplier": 1.0195
  },
  {
    "min": 983800,
    "multiplier": 1.019
  },
  {
    "min": 983700,
    "multiplier": 1.0185
  },
  {
    "min": 983600,
    "multiplier": 1.018
  },
  {
    "min": 983500,
    "multiplier": 1.0175
  },
  {
    "min": 983400,
    "multiplier": 1.017
  },
  {
    "min": 983300,
    "multiplier": 1.0165
  },
  {
    "min": 983200,
    "multiplier": 1.016
  },
  {
    "min": 983100,
    "multiplier": 1.0155
  },
  {
    "min": 983000,
    "multiplier": 1.015
  },
  {
    "min": 982900,
    "multiplier": 1.0145
  },
  {
    "min": 982800,
    "multiplier": 1.014
  },
  {
    "min": 982700,
    "multiplier": 1.0135
  },
  {
    "min": 982600,
    "multiplier": 1.013
  },
  {
    "min": 982500,
    "multiplier": 1.0125
  },
  {
    "min": 982400,
    "multiplier": 1.012
  },
  {
    "min": 982300,
    "multiplier": 1.0115
  },
  {
    "min": 982200,
    "multiplier": 1.011
  },
  {
    "min": 982100,
    "multiplier": 1.0105
  },
  {
    "min": 982000,
    "multiplier": 1.01
  },
  {
    "min": 981900,
    "multiplier": 1.0095
  },
  {
    "min": 981800,
    "multiplier": 1.009
  },
  {
    "min": 981700,
    "multiplier": 1.0085
  },
  {
    "min": 981600,
    "multiplier": 1.008
  },
  {
    "min": 981500,
    "multiplier": 1.0075
  },
  {
    "min": 981400,
    "multiplier": 1.007
  },
  {
    "min": 981300,
    "multiplier": 1.0065
  },
  {
    "min": 981200,
    "multiplier": 1.006
  },
  {
    "min": 981100,
    "multiplier": 1.0055
  },
  {
    "min": 981000,
    "multiplier": 1.005
  },
  {
    "min": 980900,
    "multiplier": 1.0045
  },
  {
    "min": 980800,
    "multiplier": 1.004
  },
  {
    "min": 980700,
    "multiplier": 1.0035
  },
  {
    "min": 980600,
    "multiplier": 1.003
  },
  {
    "min": 980500,
    "multiplier": 1.0025
  },
  {
    "min": 980400,
    "multiplier": 1.002
  },
  {
    "min": 980300,
    "multiplier": 1.0015
  },
  {
    "min": 980200,
    "multiplier": 1.001
  },
  {
    "min": 980100,
    "multiplier": 1.0005
  },
  {
    "min": 980000,
    "multiplier": 1.0
  },
  {
    "min": 979900,
    "multiplier": 0.9995
  },
  {
    "min": 979800,
    "multiplier": 0.999
  },
  {
    "min": 979700,
    "multiplier": 0.9985
  },
  {
    "min": 979600,
    "multiplier": 0.998
  },
  {
    "min": 979500,
    "multiplier": 0.9975
  },
  {
    "min": 979400,
    "multiplier": 0.997
  },
  {
    "min": 979300,
    "multiplier": 0.9965
  },
  {
    "min": 979200,
    "multiplier": 0.996
  },
  {
    "min": 979100,
    "multiplier": 0.9955
  },
  {
    "min": 979000,
    "multiplier": 0.995
  },
  {
    "min": 978900,
    "multiplier": 0.9945
  },
  {
    "min": 978800,
    "multiplier": 0.994
  },
  {
    "min": 978700,
    "multiplier": 0.9935
  },
  {
    "min": 978600,
    "multiplier": 0.993
  },
  {
    "min": 978500,
    "multiplier": 0.9925
  },
  {
    "min": 978400,
    "multiplier": 0.992
  },
  {
    "min": 978300,
    "multiplier": 0.9915
  },
  {
    "min": 978200,
    "multiplier": 0.991
  },
  {
    "min": 978100,
    "multiplier": 0.9905
  },
  {
    "min": 978000,
    "multiplier": 0.99
  },
  {
    "min": 977900,
    "multiplier": 0.9895
  },
  {
    "min": 977800,
    "multiplier": 0.989
  },
  {
    "min": 977700,
    "multiplier": 0.9885
  },
  {
    "min": 977600,
    "multiplier": 0.988
  },
  {
    "min": 977500,
    "multiplier": 0.9875
  },
  {
    "min": 977400,
    "multiplier": 0.987
  },
  {
    "min": 977300,
    "multiplier": 0.9865
  },
  {
    "min": 977200,
    "multiplier": 0.986
  },
  {
    "min": 977100,
    "multiplier": 0.9855
  },
  {
    "min": 977000,
    "multiplier": 0.985
  },
  {
    "min": 976900,
    "multiplier": 0.9845
  },
  {
    "min": 976800,
    "multiplier": 0.984
  },
  {
    "min": 976700,
    "multiplier": 0.9835
  },
  {
    "min": 976600,
    "multiplier": 0.983
  },
  {
    "min": 976500,
    "multiplier": 0.9825
  },
  {
    "min": 976400,
    "multiplier": 0.982
  },
  {
    "min": 976300,
    "multiplier": 0.9815
  },
  {
    "min": 976200,
    "multiplier": 0.981
  },
  {
    "min": 976100,
    "multiplier": 0.9805
  },
  {
    "min": 976000,
    "multiplier": 0.98
  },
  {
    "min": 975900,
    "multiplier": 0.9795
  },
  {
    "min": 975800,
    "multiplier": 0.979
  },
  {
    "min": 975700,
    "multiplier": 0.9785
  },
  {
    "min": 975600,
    "multiplier": 0.978
  },
  {
    "min": 975500,
    "multiplier": 0.9775
  },
  {
    "min": 975400,
    "multiplier": 0.977
  },
  {
    "min": 975300,
    "multiplier": 0.9765
  },
  {
    "min": 975200,
    "multiplier": 0.976
  },
  {
    "min": 975100,
    "multiplier": 0.9755
  },
  {
    "min": 975000,
    "multiplier": 0.975
  },
  {
    "min": 974900,
    "multiplier": 0.9745
  },
  {
    "min": 974800,
    "multiplier": 0.974
  },
  {
    "min": 974700,
    "multiplier": 0.9735
  },
  {
    "min": 974600,
    "multiplier": 0.973
  },
  {
    "min": 974500,
    "multiplier": 0.9725
  },
  {
    "min": 974400,
    "multiplier": 0.972
  },
  {
    "min": 974300,
    "multiplier": 0.9715
  },
  {
    "min": 974200,
    "multiplier": 0.971
  },
  {
    "min": 974100,
    "multiplier": 0.9705
  },
  {
    "min": 974000,
    "multiplier": 0.97
  },
  {
    "min": 973900,
    "multiplier": 0.9695
  },
  {
    "min": 973800,
    "multiplier": 0.969
  },
  {
    "min": 973700,
    "multiplier": 0.9685
  },
  {
    "min": 973600,
    "multiplier": 0.968
  },
  {
    "min": 973500,
    "multiplier": 0.9675
  },
  {
    "min": 973400,
    "multiplier": 0.967
  },
  {
    "min": 973300,
    "multiplier": 0.9665
  },
  {
    "min": 973200,
    "multiplier": 0.966
  },
  {
    "min": 973100,
    "multiplier": 0.9655
  },
  {
    "min": 973000,
    "multiplier": 0.965
  },
  {
    "min": 972900,
    "multiplier": 0.9645
  },
  {
    "min": 972800,
    "multiplier": 0.964
  },
  {
    "min": 972700,
    "multiplier": 0.9635
  },
  {
    "min": 972600,
    "multiplier": 0.963
  },
  {
    "min": 972500,
    "multiplier": 0.9625
  },
  {
    "min": 972400,
    "multiplier": 0.962
  },
  {
    "min": 972300,
    "multiplier": 0.9615
  },
  {
    "min": 972200,
    "multiplier": 0.961
  },
  {
    "min": 972100,
    "multiplier": 0.9605
  },
  {
    "min": 972000,
    "multiplier": 0.96
  },
  {
    "min": 971900,
    "multiplier": 0.9595
  },
  {
    "min": 971800,
    "multiplier": 0.959
  },
  {
    "min": 971700,
    "multiplier": 0.9585
  },
  {
    "min": 971600,
    "multiplier": 0.958
  },
  {
    "min": 971500,
    "multiplier": 0.9575
  },
  {
    "min": 971400,
    "multiplier": 0.957
  },
  {
    "min": 971300,
    "multiplier": 0.9565
  },
  {
    "min": 971200,
    "multiplier": 0.956
  },
  {
    "min": 971100,
    "multiplier": 0.9555
  },
  {
    "min": 971000,
    "multiplier": 0.955
  },
  {
    "min": 970900,
    "multiplier": 0.9545
  },
  {
    "min": 970800,
    "multiplier": 0.954
  },
  {
    "min": 970700,
    "multiplier": 0.9535
  },
  {
    "min": 970600,
    "multiplier": 0.953
  },
  {
    "min": 970500,
    "multiplier": 0.9525
  },
  {
    "min": 970400,
    "multiplier": 0.952
  },
  {
    "min": 970300,
    "multiplier": 0.9515
  },
  {
    "min": 970200,
    "multiplier": 0.951
  },
  {
    "min": 970100,
    "multiplier": 0.9505
  },
  {
    "min": 970000,
    "multiplier": 0.95
  },
  {
    "min": 969900,
    "multiplier": 0.9495
  },
  {
    "min": 969800,
    "multiplier": 0.949
  },
  {
    "min": 969700,
    "multiplier": 0.9485
  },
  {
    "min": 969600,
    "multiplier": 0.948
  },
  {
    "min": 969500,
    "multiplier": 0.9475
  },
  {
    "min": 969400,
    "multiplier": 0.947
  },
  {
    "min": 969300,
    "multiplier": 0.9465
  },
  {
    "min": 969200,
    "multiplier": 0.946
  },
  {
    "min": 969100,
    "multiplier": 0.9455
  },
  {
    "min": 969000,
    "multiplier": 0.945
  },
  {
    "min": 968900,
    "multiplier": 0.9445
  },
  {
    "min": 968800,
    "multiplier": 0.944
  },
  {
    "min": 968700,
    "multiplier": 0.9435
  },
  {
    "min": 968600,
    "multiplier": 0.943
  },
  {
    "min": 968500,
    "multiplier": 0.9425
  },
  {
    "min": 968400,
    "multiplier": 0.942
  },
  {
    "min": 968300,
    "multiplier": 0.9415
  },
  {
    "min": 968200,
    "multiplier": 0.941
  },
  {
    "min": 968100,
    "multiplier": 0.9405
  },
  {
    "min": 968000,
    "multiplier": 0.94
  },
  {
    "min": 967900,
    "multiplier": 0.9395
  },
  {
    "min": 967800,
    "multiplier": 0.939
  },
  {
    "min": 967700,
    "multiplier": 0.9385
  },
  {
    "min": 967600,
    "multiplier": 0.938
  },
  {
    "min": 967500,
    "multiplier": 0.9375
  },
  {
    "min": 967400,
    "multiplier": 0.937
  },
  {
    "min": 967300,
    "multiplier": 0.9365
  },
  {
    "min": 967200,
    "multiplier": 0.936
  },
  {
    "min": 967100,
    "multiplier": 0.9355
  },
  {
    "min": 967000,
    "multiplier": 0.935
  },
  {
    "min": 966900,
    "multiplier": 0.9345
  },
  {
    "min": 966800,
    "multiplier": 0.934
  },
  {
    "min": 966700,
    "multiplier": 0.9335
  },
  {
    "min": 966600,
    "multiplier": 0.933
  },
  {
    "min": 966500,
    "multiplier": 0.9325
  },
  {
    "min": 966400,
    "multiplier": 0.932
  },
  {
    "min": 966300,
    "multiplier": 0.9315
  },
  {
    "min": 966200,
    "multiplier": 0.931
  },
  {
    "min": 966100,
    "multiplier": 0.9305
  },
  {
    "min": 966000,
    "multiplier": 0.93
  },
  {
    "min": 965900,
    "multiplier": 0.9295
  },
  {
    "min": 965800,
    "multiplier": 0.929
  },
  {
    "min": 965700,
    "multiplier": 0.9285
  },
  {
    "min": 965600,
    "multiplier": 0.928
  },
  {
    "min": 965500,
    "multiplier": 0.9275
  },
  {
    "min": 965400,
    "multiplier": 0.927
  },
  {
    "min": 965300,
    "multiplier": 0.9265
  },
  {
    "min": 965200,
    "multiplier": 0.926
  },
  {
    "min": 965100,
    "multiplier": 0.9255
  },
  {
    "min": 965000,
    "multiplier": 0.925
  },
  {
    "min": 964900,
    "multiplier": 0.9245
  },
  {
    "min": 964800,
    "multiplier": 0.924
  },
  {
    "min": 964700,
    "multiplier": 0.9235
  },
  {
    "min": 964600,
    "multiplier": 0.923
  },
  {
    "min": 964500,
    "multiplier": 0.9225
  },
  {
    "min": 964400,
    "multiplier": 0.922
  },
  {
    "min": 964300,
    "multiplier": 0.9215
  },
  {
    "min": 964200,
    "multiplier": 0.921
  },
  {
    "min": 964100,
    "multiplier": 0.9205
  },
  {
    "min": 964000,
    "multiplier": 0.92
  },
  {
    "min": 963900,
    "multiplier": 0.9195
  },
  {
    "min": 963800,
    "multiplier": 0.919
  },
  {
    "min": 963700,
    "multiplier": 0.9185
  },
  {
    "min": 963600,
    "multiplier": 0.918
  },
  {
    "min": 963500,
    "multiplier": 0.9175
  },
  {
    "min": 963400,
    "multiplier": 0.917
  },
  {
    "min": 963300,
    "multiplier": 0.9165
  },
  {
    "min": 963200,
    "multiplier": 0.916
  },
  {
    "min": 963100,
    "multiplier": 0.9155
  },
  {
    "min": 963000,
    "multiplier": 0.915
  },
  {
    "min": 962900,
    "multiplier": 0.9145
  },
  {
    "min": 962800,
    "multiplier": 0.914
  },
  {
    "min": 962700,
    "multiplier": 0.9135
  },
  {
    "min": 962600,
    "multiplier": 0.913
  },
  {
    "min": 962500,
    "multiplier": 0.9125
  },
  {
    "min": 962400,
    "multiplier": 0.912
  },
  {
    "min": 962300,
    "multiplier": 0.9115
  },
  {
    "min": 962200,
    "multiplier": 0.911
  },
  {
    "min": 962100,
    "multiplier": 0.9105
  },
  {
    "min": 962000,
    "multiplier": 0.91
  },
  {
    "min": 961900,
    "multiplier": 0.9095
  },
  {
    "min": 961800,
    "multiplier": 0.909
  },
  {
    "min": 961700,
    "multiplier": 0.9085
  },
  {
    "min": 961600,
    "multiplier": 0.908
  },
  {
    "min": 961500,
    "multiplier": 0.9075
  },
  {
    "min": 961400,
    "multiplier": 0.907
  },
  {
    "min": 961300,
    "multiplier": 0.9065
  },
  {
    "min": 961200,
    "multiplier": 0.906
  },
  {
    "min": 961100,
    "multiplier": 0.9055
  },
  {
    "min": 961000,
    "multiplier": 0.905
  },
  {
    "min": 960900,
    "multiplier": 0.9045
  },
  {
    "min": 960800,
    "multiplier": 0.904
  },
  {
    "min": 960700,
    "multiplier": 0.9035
  },
  {
    "min": 960600,
    "multiplier": 0.903
  },
  {
    "min": 960500,
    "multiplier": 0.9025
  },
  {
    "min": 960400,
    "multiplier": 0.902
  },
  {
    "min": 960300,
    "multiplier": 0.9015
  },
  {
    "min": 960200,
    "multiplier": 0.901
  },
  {
    "min": 960100,
    "multiplier": 0.9005
  },
  {
    "min": 960000,
    "multiplier": 0.9
  },
  {
    "min": 959900,
    "multiplier": 0.8995
  },
  {
    "min": 959800,
    "multiplier": 0.899
  },
  {
    "min": 959700,
    "multiplier": 0.8985
  },
  {
    "min": 959600,
    "multiplier": 0.898
  },
  {
    "min": 959500,
    "multiplier": 0.8975
  },
  {
    "min": 959400,
    "multiplier": 0.897
  },
  {
    "min": 959300,
    "multiplier": 0.8965
  },
  {
    "min": 959200,
    "multiplier": 0.896
  },
  {
    "min": 959100,
    "multiplier": 0.8955
  },
  {
    "min": 959000,
    "multiplier": 0.895
  },
  {
    "min": 958900,
    "multiplier": 0.8945
  },
  {
    "min": 958800,
    "multiplier": 0.894
  },
  {
    "min": 958700,
    "multiplier": 0.8935
  },
  {
    "min": 958600,
    "multiplier": 0.893
  },
  {
    "min": 958500,
    "multiplier": 0.8925
  },
  {
    "min": 958400,
    "multiplier": 0.892
  },
  {
    "min": 958300,
    "multiplier": 0.8915
  },
  {
    "min": 958200,
    "multiplier": 0.891
  },
  {
    "min": 958100,
    "multiplier": 0.8905
  },
  {
    "min": 958000,
    "multiplier": 0.89
  },
  {
    "min": 957900,
    "multiplier": 0.8895
  },
  {
    "min": 957800,
    "multiplier": 0.889
  },
  {
    "min": 957700,
    "multiplier": 0.8885
  },
  {
    "min": 957600,
    "multiplier": 0.888
  },
  {
    "min": 957500,
    "multiplier": 0.8875
  },
  {
    "min": 957400,
    "multiplier": 0.887
  },
  {
    "min": 957300,
    "multiplier": 0.8865
  },
  {
    "min": 957200,
    "multiplier": 0.886
  },
  {
    "min": 957100,
    "multiplier": 0.8855
  },
  {
    "min": 957000,
    "multiplier": 0.885
  },
  {
    "min": 956900,
    "multiplier": 0.8845
  },
  {
    "min": 956800,
    "multiplier": 0.884
  },
  {
    "min": 956700,
    "multiplier": 0.8835
  },
  {
    "min": 956600,
    "multiplier": 0.883
  },
  {
    "min": 956500,
    "multiplier": 0.8825
  },
  {
    "min": 956400,
    "multiplier": 0.882
  },
  {
    "min": 956300,
    "multiplier": 0.8815
  },
  {
    "min": 956200,
    "multiplier": 0.881
  },
  {
    "min": 956100,
    "multiplier": 0.8805
  },
  {
    "min": 956000,
    "multiplier": 0.88
  },
  {
    "min": 955900,
    "multiplier": 0.8795
  },
  {
    "min": 955800,
    "multiplier": 0.879
  },
  {
    "min": 955700,
    "multiplier": 0.8785
  },
  {
    "min": 955600,
    "multiplier": 0.878
  },
  {
    "min": 955500,
    "multiplier": 0.8775
  },
  {
    "min": 955400,
    "multiplier": 0.877
  },
  {
    "min": 955300,
    "multiplier": 0.8765
  },
  {
    "min": 955200,
    "multiplier": 0.876
  },
  {
    "min": 955100,
    "multiplier": 0.8755
  },
  {
    "min": 955000,
    "multiplier": 0.875
  },
  {
    "min": 954900,
    "multiplier": 0.8745
  },
  {
    "min": 954800,
    "multiplier": 0.874
  },
  {
    "min": 954700,
    "multiplier": 0.8735
  },
  {
    "min": 954600,
    "multiplier": 0.873
  },
  {
    "min": 954500,
    "multiplier": 0.8725
  },
  {
    "min": 954400,
    "multiplier": 0.872
  },
  {
    "min": 954300,
    "multiplier": 0.8715
  },
  {
    "min": 954200,
    "multiplier": 0.871
  },
  {
    "min": 954100,
    "multiplier": 0.8705
  },
  {
    "min": 954000,
    "multiplier": 0.87
  },
  {
    "min": 953900,
    "multiplier": 0.8695
  },
  {
    "min": 953800,
    "multiplier": 0.869
  },
  {
    "min": 953700,
    "multiplier": 0.8685
  },
  {
    "min": 953600,
    "multiplier": 0.868
  },
  {
    "min": 953500,
    "multiplier": 0.8675
  },
  {
    "min": 953400,
    "multiplier": 0.867
  },
  {
    "min": 953300,
    "multiplier": 0.8665
  },
  {
    "min": 953200,
    "multiplier": 0.866
  },
  {
    "min": 953100,
    "multiplier": 0.8655
  },
  {
    "min": 953000,
    "multiplier": 0.865
  },
  {
    "min": 952900,
    "multiplier": 0.8645
  },
  {
    "min": 952800,
    "multiplier": 0.864
  },
  {
    "min": 952700,
    "multiplier": 0.8635
  },
  {
    "min": 952600,
    "multiplier": 0.863
  },
  {
    "min": 952500,
    "multiplier": 0.8625
  },
  {
    "min": 952400,
    "multiplier": 0.862
  },
  {
    "min": 952300,
    "multiplier": 0.8615
  },
  {
    "min": 952200,
    "multiplier": 0.861
  },
  {
    "min": 952100,
    "multiplier": 0.8605
  },
  {
    "min": 952000,
    "multiplier": 0.86
  },
  {
    "min": 951900,
    "multiplier": 0.8595
  },
  {
    "min": 951800,
    "multiplier": 0.859
  },
  {
    "min": 951700,
    "multiplier": 0.8585
  },
  {
    "min": 951600,
    "multiplier": 0.858
  },
  {
    "min": 951500,
    "multiplier": 0.8575
  },
  {
    "min": 951400,
    "multiplier": 0.857
  },
  {
    "min": 951300,
    "multiplier": 0.8565
  },
  {
    "min": 951200,
    "multiplier": 0.856
  },
  {
    "min": 951100,
    "multiplier": 0.8555
  },
  {
    "min": 951000,
    "multiplier": 0.855
  },
  {
    "min": 950900,
    "multiplier": 0.8545
  },
  {
    "min": 950800,
    "multiplier": 0.854
  },
  {
    "min": 950700,
    "multiplier": 0.8535
  },
  {
    "min": 950600,
    "multiplier": 0.853
  },
  {
    "min": 950500,
    "multiplier": 0.8525
  },
  {
    "min": 950400,
    "multiplier": 0.852
  },
  {
    "min": 950300,
    "multiplier": 0.8515
  },
  {
    "min": 950200,
    "multiplier": 0.851
  },
  {
    "min": 950100,
    "multiplier": 0.8505
  },
  {
    "min": 950000,
    "multiplier": 0.85
  },
  {
    "min": 949000,
    "multiplier": 0.845
  },
  {
    "min": 948000,
    "multiplier": 0.84
  },
  {
    "min": 947000,
    "multiplier": 0.835
  },
  {
    "min": 946000,
    "multiplier": 0.83
  },
  {
    "min": 945000,
    "multiplier": 0.825
  },
  {
    "min": 944000,
    "multiplier": 0.82
  },
  {
    "min": 943000,
    "multiplier": 0.815
  },
  {
    "min": 942000,
    "multiplier": 0.81
  },
  {
    "min": 941000,
    "multiplier": 0.805
  },
  {
    "min": 940000,
    "multiplier": 0.8
  },
  {
    "min": 939000,
    "multiplier": 0.795
  },
  {
    "min": 938000,
    "multiplier": 0.79
  },
  {
    "min": 937000,
    "multiplier": 0.785
  },
  {
    "min": 936000,
    "multiplier": 0.78
  },
  {
    "min": 935000,
    "multiplier": 0.775
  },
  {
    "min": 934000,
    "multiplier": 0.77
  },
  {
    "min": 933000,
    "multiplier": 0.765
  },
  {
    "min": 932000,
    "multiplier": 0.76
  },
  {
    "min": 931000,
    "multiplier": 0.755
  },
  {
    "min": 930000,
    "multiplier": 0.75
  },
  {
    "min": 929000,
    "multiplier": 0.745
  },
  {
    "min": 928000,
    "multiplier": 0.74
  },
  {
    "min": 927000,
    "multiplier": 0.735
  },
  {
    "min": 926000,
    "multiplier": 0.73
  },
  {
    "min": 925000,
    "multiplier": 0.725
  },
  {
    "min": 924000,
    "multiplier": 0.72
  },
  {
    "min": 923000,
    "multiplier": 0.715
  },
  {
    "min": 922000,
    "multiplier": 0.71
  },
  {
    "min": 921000,
    "multiplier": 0.705
  },
  {
    "min": 920000,
    "multiplier": 0.7
  },
  {
    "min": 919000,
    "multiplier": 0.695
  },
  {
    "min": 918000,
    "multiplier": 0.69
  },
  {
    "min": 917000,
    "multiplier": 0.685
  },
  {
    "min": 916000,
    "multiplier": 0.68
  },
  {
    "min": 915000,
    "multiplier": 0.675
  },
  {
    "min": 914000,
    "multiplier": 0.67
  },
  {
    "min": 913000,
    "multiplier": 0.665
  },
  {
    "min": 912000,
    "multiplier": 0.66
  },
  {
    "min": 911000,
    "multiplier": 0.655
  },
  {
    "min": 910000,
    "multiplier": 0.65
  },
  {
    "min": 909000,
    "multiplier": 0.645
  },
  {
    "min": 908000,
    "multiplier": 0.64
  },
  {
    "min": 907000,
    "multiplier": 0.635
  },
  {
    "min": 906000,
    "multiplier": 0.63
  },
  {
    "min": 905000,
    "multiplier": 0.625
  },
  {
    "min": 904000,
    "multiplier": 0.62
  },
  {
    "min": 903000,
    "multiplier": 0.615
  },
  {
    "min": 902000,
    "multiplier": 0.61
  },
  {
    "min": 901000,
    "multiplier": 0.605
  },
  {
    "min": 900000,
    "multiplier": 0.6
  },
  {
    "min": 899000,
    "multiplier": 0.593
  },
  {
    "min": 898000,
    "multiplier": 0.586
  },
  {
    "min": 897000,
    "multiplier": 0.579
  },
  {
    "min": 896000,
    "multiplier": 0.572
  },
  {
    "min": 895000,
    "multiplier": 0.565
  },
  {
    "min": 894000,
    "multiplier": 0.558
  },
  {
    "min": 893000,
    "multiplier": 0.551
  },
  {
    "min": 892000,
    "multiplier": 0.544
  },
  {
    "min": 891000,
    "multiplier": 0.537
  },
  {
    "min": 890000,
    "multiplier": 0.53
  },
  {
    "min": 889000,
    "multiplier": 0.523
  },
  {
    "min": 888000,
    "multiplier": 0.516
  },
  {
    "min": 887000,
    "multiplier": 0.509
  },
  {
    "min": 886000,
    "multiplier": 0.502
  },
  {
    "min": 885000,
    "multiplier": 0.495
  },
  {
    "min": 884000,
    "multiplier": 0.488
  },
  {
    "min": 883000,
    "multiplier": 0.481
  },
  {
    "min": 882000,
    "multiplier": 0.474
  },
  {
    "min": 881000,
    "multiplier": 0.467
  },
  {
    "min": 880000,
    "multiplier": 0.46
  },
  {
    "min": 879000,
    "multiplier": 0.453
  },
  {
    "min": 878000,
    "multiplier": 0.446
  },
  {
    "min": 877000,
    "multiplier": 0.439
  },
  {
    "min": 876000,
    "multiplier": 0.432
  },
  {
    "min": 875000,
    "multiplier": 0.425
  },
  {
    "min": 874000,
    "multiplier": 0.418
  },
  {
    "min": 873000,
    "multiplier": 0.411
  },
  {
    "min": 872000,
    "multiplier": 0.404
  },
  {
    "min": 871000,
    "multiplier": 0.397
  },
  {
    "min": 870000,
    "multiplier": 0.39
  },
  {
    "min": 869000,
    "multiplier": 0.383
  },
  {
    "min": 868000,
    "multiplier": 0.376
  },
  {
    "min": 867000,
    "multiplier": 0.369
  },
  {
    "min": 866000,
    "multiplier": 0.362
  },
  {
    "min": 865000,
    "multiplier": 0.355
  },
  {
    "min": 864000,
    "multiplier": 0.348
  },
  {
    "min": 863000,
    "multiplier": 0.341
  },
  {
    "min": 862000,
    "multiplier": 0.334
  },
  {
    "min": 861000,
    "multiplier": 0.327
  },
  {
    "min": 860000,
    "multiplier": 0.32
  },
  {
    "min": 859000,
    "multiplier": 0.313
  },
  {
    "min": 858000,
    "multiplier": 0.306
  },
  {
    "min": 857000,
    "multiplier": 0.299
  },
  {
    "min": 856000,
    "multiplier": 0.292
  },
  {
    "min": 855000,
    "multiplier": 0.285
  },
  {
    "min": 854000,
    "multiplier": 0.278
  },
  {
    "min": 853000,
    "multiplier": 0.271
  },
  {
    "min": 852000,
    "multiplier": 0.264
  },
  {
    "min": 851000,
    "multiplier": 0.257
  },
  {
    "min": 850000,
    "multiplier": 0.25
  },
  {
    "min": 849000,
    "multiplier": 0.249
  },
  {
    "min": 848000,
    "multiplier": 0.248
  },
  {
    "min": 847000,
    "multiplier": 0.247
  },
  {
    "min": 846000,
    "multiplier": 0.246
  },
  {
    "min": 845000,
    "multiplier": 0.245
  },
  {
    "min": 844000,
    "multiplier": 0.244
  },
  {
    "min": 843000,
    "multiplier": 0.243
  },
  {
    "min": 842000,
    "multiplier": 0.242
  },
  {
    "min": 841000,
    "multiplier": 0.241
  },
  {
    "min": 840000,
    "multiplier": 0.24
  },
  {
    "min": 839000,
    "multiplier": 0.239
  },
  {
    "min": 838000,
    "multiplier": 0.238
  },
  {
    "min": 837000,
    "multiplier": 0.237
  },
  {
    "min": 836000,
    "multiplier": 0.236
  },
  {
    "min": 835000,
    "multiplier": 0.235
  },
  {
    "min": 834000,
    "multiplier": 0.234
  },
  {
    "min": 833000,
    "multiplier": 0.233
  },
  {
    "min": 832000,
    "multiplier": 0.232
  },
  {
    "min": 831000,
    "multiplier": 0.231
  },
  {
    "min": 830000,
    "multiplier": 0.23
  },
  {
    "min": 829000,
    "multiplier": 0.229
  },
  {
    "min": 828000,
    "multiplier": 0.228
  },
  {
    "min": 827000,
    "multiplier": 0.227
  },
  {
    "min": 826000,
    "multiplier": 0.226
  },
  {
    "min": 825000,
    "multiplier": 0.225
  },
  {
    "min": 824000,
    "multiplier": 0.224
  },
  {
    "min": 823000,
    "multiplier": 0.223
  },
  {
    "min": 822000,
    "multiplier": 0.222
  },
  {
    "min": 821000,
    "multiplier": 0.221
  },
  {
    "min": 820000,
    "multiplier": 0.22
  },
  {
    "min": 819000,
    "multiplier": 0.219
  },
  {
    "min": 818000,
    "multiplier": 0.218
  },
  {
    "min": 817000,
    "multiplier": 0.217
  },
  {
    "min": 816000,
    "multiplier": 0.216
  },
  {
    "min": 815000,
    "multiplier": 0.215
  },
  {
    "min": 814000,
    "multiplier": 0.214
  },
  {
    "min": 813000,
    "multiplier": 0.213
  },
  {
    "min": 812000,
    "multiplier": 0.212
  },
  {
    "min": 811000,
    "multiplier": 0.211
  },
  {
    "min": 810000,
    "multiplier": 0.21
  },
  {
    "min": 809000,
    "multiplier": 0.209
  },
  {
    "min": 808000,
    "multiplier": 0.208
  },
  {
    "min": 807000,
    "multiplier": 0.207
  },
  {
    "min": 806000,
    "multiplier": 0.206
  },
  {
    "min": 805000,
    "multiplier": 0.205
  },
  {
    "min": 804000,
    "multiplier": 0.204
  },
  {
    "min": 803000,
    "multiplier": 0.203
  },
  {
    "min": 802000,
    "multiplier": 0.202
  },
  {
    "min": 801000,
    "multiplier": 0.201
  },
  {
    "min": 800000,
    "multiplier": 0.2
  },
  {
    "min": 790000,
    "multiplier": 0.195
  },
  {
    "min": 780000,
    "multiplier": 0.19
  },
  {
    "min": 770000,
    "multiplier": 0.185
  },
  {
    "min": 760000,
    "multiplier": 0.18
  },
  {
    "min": 750000,
    "multiplier": 0.175
  },
  {
    "min": 740000,
    "multiplier": 0.17
  },
  {
    "min": 730000,
    "multiplier": 0.165
  },
  {
    "min": 720000,
    "multiplier": 0.16
  },
  {
    "min": 710000,
    "multiplier": 0.155
  },
  {
    "min": 700000,
    "multiplier": 0.15
  },
  {
    "min": 690000,
    "multiplier": 0.145
  },
  {
    "min": 680000,
    "multiplier": 0.14
  },
  {
    "min": 670000,
    "multiplier": 0.135
  },
  {
    "min": 660000,
    "multiplier": 0.13
  },
  {
    "min": 650000,
    "multiplier": 0.125
  },
  {
    "min": 640000,
    "multiplier": 0.12
  },
  {
    "min": 630000,
    "multiplier": 0.115
  },
  {
    "min": 620000,
    "multiplier": 0.11
  },
  {
    "min": 610000,
    "multiplier": 0.105
  },
  {
    "min": 600000,
    "multiplier": 0.1
  },
  {
    "min": 590000,
    "multiplier": 0.095
  },
  {
    "min": 580000,
    "multiplier": 0.09
  },
  {
    "min": 570000,
    "multiplier": 0.085
  },
  {
    "min": 560000,
    "multiplier": 0.08
  },
  {
    "min": 550000,
    "multiplier": 0.075
  },
  {
    "min": 540000,
    "multiplier": 0.07
  },
  {
    "min": 530000,
    "multiplier": 0.065
  },
  {
    "min": 520000,
    "multiplier": 0.06
  },
  {
    "min": 510000,
    "multiplier": 0.055
  },
  {
    "min": 500000,
    "multiplier": 0.05
  },
  {
    "min": 490000,
    "multiplier": 0.045
  },
  {
    "min": 480000,
    "multiplier": 0.04
  },
  {
    "min": 470000,
    "multiplier": 0.035
  },
  {
    "min": 460000,
    "multiplier": 0.03
  },
  {
    "min": 450000,
    "multiplier": 0.025
  },
  {
    "min": 440000,
    "multiplier": 0.02
  },
  {
    "min": 430000,
    "multiplier": 0.015
  },
  {
    "min": 420000,
    "multiplier": 0.01
  },
  {
    "min": 410000,
    "multiplier": 0.005
  },
  {
    "min": 400000,
    "multiplier": 0
  }
];

export default ratingBorders;
