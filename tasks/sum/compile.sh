# clean previous build
rm -fr build
rm -fr result

# create build, result dir
mkdir build
mkdir result

# compile generator, solution, checker
(
    echo "g++ source/checker.cpp -o result/checker"; 
    echo "g++ source/solution.cpp -o build/solution";
    echo "g++ source/generator.cpp -o build/generator";
) | parallel -t

# generate tests
mkdir result/tests
(cd ./result/tests && ../../build/generator)

# generate answers for the tests
ls result/tests | parallel -t "build/solution < result/tests/{} > result/tests/{}.a"

# remove build folder
rm -r build